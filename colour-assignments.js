const tree = { val: "a", children: [] };

function insert(parent, val, tree) {
  if (!tree) {
    return;
  }

  if (tree.val === parent) {
    tree.children.push({ val, children: [] });
  } else {
    tree.children.forEach((child) => insert(parent, val, child));
  }
}

function print(tree, depth = 0) {
  if (!tree) {
    return 0;
  }
  let indent = "";
  for (let i = 0; i < depth; i++) {
    if (i < depth - 1) {
      indent += "    ";
    } else {
      indent += "|---";
    }
  }
  console.log(indent + tree.val);

  tree.children.forEach((child) => {
    print(child, depth + 1);
  });
}

insert("a", "b", tree);
insert("a", "c", tree);
insert("c", "d", tree);
insert("c", "e", tree);
insert("b", "f", tree);
insert("e", "g", tree);

// console.log(JSON.stringify(tree, null, 2));
print(tree);
