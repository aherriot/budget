function buildAccountTree(parentId, accountsById) {
  const children = [];
  Object.values(accountsById).forEach((account) => {
    if (account.parentId === parentId) {
      children.push({
        // title: <TreeRow account={account} />,
        key: account.id,
        children: buildAccountTree(account.id, accountsById),
      });
    }
  });
  return children;
}
export default buildAccountTree;
