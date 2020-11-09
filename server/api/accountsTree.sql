-- accounts_tree represents a list of accounts and all child accounts
with recursive accounts_tree as (
    select id,
        parent_id,
        name,
        type
    from accounts
    where user_id = 1
        and parent_id is null
    union
    select children.id,
        children.parent_id,
        children.name,
        children.type
    from accounts children
        inner join accounts_tree on accounts_tree.id = children.parent_id
),
-- accounts_tree_sums joins in all the transactions that match these accounts
accounts_tree_sums as (
    select accounts_tree.id,
        accounts_tree.parent_id,
        accounts_tree.name,
        accounts_tree.type,
        sum(t.amount) filter (
            where accounts_tree.id = t.in_account
        ) as in_total,
        sum(t.amount) filter (
            where accounts_tree.id = t.out_account
        ) as out_total
    from accounts_tree
        left join transactions t on (
            accounts_tree.id = t.in_account
            or accounts_tree.id = t.out_account
        )
        and (
            (
                t.in_date > $1
                and t.in_date < $2
            )
            or (
                t.out_date > $1
                and t.out_date < $2
            )
        )
    group by accounts_tree.id,
        accounts_tree.parent_id,
        accounts_tree.name,
        accounts_tree.type
),
-- accounts_tree_totals expands the rows out, so we can bubble up the sums including their children
accounts_tree_totals as (
    select accounts_tree_sums.id,
        accounts_tree_sums.parent_id,
        accounts_tree_sums.name,
        accounts_tree_sums.type,
        accounts_tree_sums.in_total,
        accounts_tree_sums.out_total
    from accounts_tree_sums
    union
    select accounts_tree_sums.id,
        accounts_tree_sums.parent_id,
        accounts_tree_sums.name,
        accounts_tree_sums.type,
        accounts_tree_totals.in_total,
        accounts_tree_totals.out_total
    from accounts_tree_sums
        inner join accounts_tree_totals on accounts_tree_totals.parent_id = accounts_tree_sums.id
) -- finally we aggragate it all together to find the sum for each account including children
select accounts_tree_totals.id,
    accounts_tree_totals.parent_id,
    accounts_tree_totals.name,
    accounts_tree_totals.type,
    sum(accounts_tree_totals.in_total) as in_total,
    sum(accounts_tree_totals.out_total) as out_total,
    sum(
        case
            -- when accounts_tree_totals.type in ('INCOME') then 0
            -- when accounts_tree_totals.type in ('EXPENSE', 'LIABILITY') then 0
            when 1 = 2 then 0
            else coalesce(accounts_tree_totals.in_total, 0) - coalesce(accounts_tree_totals.out_total, 0)
        end
    ) as total
from accounts_tree_totals
group by accounts_tree_totals.id,
    accounts_tree_totals.parent_id,
    accounts_tree_totals.name,
    accounts_tree_totals.type;