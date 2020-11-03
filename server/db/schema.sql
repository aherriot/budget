create table users (
  id serial primary key,
  username varchar(20) not null unique,
  email varchar(128) not null unique,
  password varchar(128),
  last_login_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create type account_type as enum (
  'ASSET',
  'LIABILITY',
  'EXPENSE',
  'INCOME',
  'EQUITY'
);
create table accounts (
  id serial primary key,
  parent_id integer references accounts,
  type account_type not null,
  user_id integer references users not null,
  name varchar(50) not null
);
create table transactions (
  id serial primary key,
  amount integer not null,
  description varchar(256) not null,
  in_date date not null default current_date,
  out_date date not null default current_date,
  in_account integer references accounts not null,
  out_account integer references accounts not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
-- when associating transactions with input and outputs
-- use this table to suggest what accounts the transaction is linked to
create table transaction_hints (
  id serial primary key,
  user_id integer references users not null,
  account_id integer references accounts not null,
  text varchar(100) not null,
  isIn boolean -- whether this applies to transaction in or transaction out
);
-- test
with recursive accounts_tree as (
  select id,
    parent_id,
    name
  from accounts
  where user_id = 1
    and parent_id = 11
  union
  select children.id,
    children.parent_id,
    children.name
  from accounts children
    inner join accounts_tree on accounts_tree.id = children.parent_id
)
select accounts_tree.id,
  accounts_tree.parent_id,
  accounts_tree.name
from accounts_tree;