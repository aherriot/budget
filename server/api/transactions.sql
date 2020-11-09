-- build recursive list of accounts and all child accounts
with recursive accounts_tree as (
    select id,
        parent_id,
        name,
        type
    from accounts
    where user_id = $1
        and id = $2
    union
    select children.id,
        children.parent_id,
        children.name,
        children.type
    from accounts children
        inner join accounts_tree on accounts_tree.id = children.parent_id
),
-- find all transactions where the out_account matches
-- and union it with all transactions where the in_account matches
-- creating a list of all transactions coming in and out of each account in tree
account_transactions as (
    select out_t.id,
        null as in_amount,
        out_t.amount as out_amount
    from accounts_tree at
        inner join transactions out_t on out_t.out_account = at.id
        and out_t.out_date >= $3
        and out_t.out_date <= $4
    union
    select in_t.id,
        in_t.amount as in_amount,
        null as out_amount
    from accounts_tree at
        inner join transactions in_t on in_t.in_account = at.id
        and in_t.out_date >= $3
        and in_t.out_date <= $4
),
-- group the transactions back together by transaction id
-- if in_amount and out_amount both have values,
-- it means it is an internal transfer within this account branch
merged_transactions as (
    select account_transactions.id,
        max(account_transactions.out_amount) as out_amount,
        max(account_transactions.in_amount) as in_amount
    from account_transactions
    group by account_transactions.id
) -- finally join in the remaining transaction details
-- since they can't be apart of the aggregation above
select mt.*,
    t.description,
    t.in_date,
    t.out_date,
    t.in_account,
    t.out_account,
    t.created_at,
    t.updated_at
from merged_transactions mt
    left join transactions t on mt.id = t.id
order by t.out_date;