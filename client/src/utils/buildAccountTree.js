function buildAccountTree(parentId, accountsById) {
  const children = [];
  Object.values(accountsById).forEach(account => {
    if (account.parent_id === parentId) {
      children.push({
        title: <TreeRow account={account} />,
        key: account.id,
        children: buildAccountTree(account.id, accountsById)
      });
    }
  });
  return children;
}
export default buildAccountTree;
