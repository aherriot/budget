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
)
select t.*
from accounts_tree at
    inner join transactions t on t.out_account = at.id
    or t.in_account = at.id
group by t.id;