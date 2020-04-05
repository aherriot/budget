insert into users (username, email, password) values ('aherriot', 'agherriot@gmail.com', 'password');

insert into accounts (parent_id, type, user_id, name) 
  values (null, 'ASSET', (select id from users where username = 'aherriot'), 'Accounts');

insert into accounts (parent_id, type, user_id, name) values (1, 'INCOME',  1, 'Income');
insert into accounts (parent_id, type, user_id, name) values (2, 'INCOME',  1, 'Maryam');
insert into accounts (parent_id, type, user_id, name) values (2, 'INCOME',  1, 'Andrew');

insert into accounts (parent_id, type, user_id, name) values (1, 'EXPENSE',  1, 'Expenses');


insert into accounts (parent_id, type, user_id, name) values (5, 'EXPENSE', 1, 'Transit');
insert into accounts (parent_id, type, user_id, name) values (6, 'EXPENSE', 1, 'Car');
insert into accounts (parent_id, type, user_id, name) values (7, 'EXPENSE', 1, 'Gas');
insert into accounts (parent_id, type, user_id, name) values (7, 'EXPENSE', 1, 'Maintenance');
insert into accounts (parent_id, type, user_id, name) values (5, 'EXPENSE', 1, 'Vacation');
insert into accounts (parent_id, type, user_id, name) values (5, 'EXPENSE', 1, 'Entertainment');
insert into accounts (parent_id, type, user_id, name) values (5, 'EXPENSE', 1, 'Restaurants');
insert into accounts (parent_id, type, user_id, name) values (5, 'EXPENSE', 1, 'Kian');
insert into accounts (parent_id, type, user_id, name) values (5, 'EXPENSE', 1, 'Groceries');
insert into accounts (parent_id, type, user_id, name) values (11, 'EXPENSE', 1, 'Toys');