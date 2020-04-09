# Monaka

![](https://user-images.githubusercontent.com/10832834/78240949-a40aeb80-751a-11ea-94ce-72ab9b6a2a72.PNG)

Project Editor component that has a UI similar to the Visual Studio Code for React.  
The goal of this repository is to provide an editor that can be used on the web with a UI similar to the VS Code.  
This project is used in [mika-f/Arteria](https://github.com/mika-f/Arteria) frontend.  
You can try this project in Arteria!

## Usage

### Installation

```bash
$ touch .npmrc
$ echo "@mika-f:registry=https://npm.pkg.github.com/" >> .npmrc
$ yarn add @mika-f/monaka
```

### Write code

```tsx
import React, { useState } from "react";
import Monaka, { Item, Section } from "@mikazuki/monaka";

const App: React.FC = () => {
  const [items, setItems] = useState<Item>([]);

  const onItemCreated = (item: Item) => {
    //
  };

  const onItemDeleted = (item: Item) => {
    //
  };

  const onItemsChanged = (items: Item[]) => {
    //
  };

  return (
    <Monaka onItemCreated={onItemCreated} onItemDeleted={onItemDeleted} onItemsChanged={onItemChanged}>
      {/* Your custom sidebar here */}
    </Monaka>
  );
};
```

## Customize

### File Icons

Monaka supports filetype icons by React Context.  
Custom filetype icons examples are here:

- `src/components/IconProvider/index.stories.tsx`
- `src/components/Monaka/index.stories.tsx`

### File Extensions

Monaka does not contain filetype association but supported by React Context.  
Custom filetype associations examples are here:

- `src/components/Monaka/index.stories.tsx`

## Credits

The icons in the this project are from [vscode-icons/vscode-icons](https://github.com/vscode-icons/vscode-icons) and [Microsoft/vscode-icons](https://github.com/microsoft/vscode-icons).

- `vscode-icons/vscode-icons` section icons in `src/components/Icon` are licensed under the CC-BY-SA.
- `Microsoft/vscode-icons` section icons in `src/components/Icon` are licensed under the CC-BY 4.0 International.
