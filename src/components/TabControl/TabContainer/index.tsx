import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { FileItem } from "@/types";
import Scroller from "@/components/Scroller";
import TabItem from "@/components/TabControl/TabItem";
import { ThemeContext, Theme } from "@/components/ThemeProvider";

type Props = {
  items: FileItem[];
  bufferedItems?: FileItem[] | null;
  selectedItem?: FileItem | null;
  onTabSelected?: (item: FileItem) => void;

  onCloseAllClicked?: () => void;
  onCloseOthersClicked?: (item: FileItem) => void;
  onCloseRightsClicked?: (item: FileItem) => void;
  onCloseSavedClicked?: () => void;
  onCloseThisClicked?: (item: FileItem) => void;
};

type WrapperProps = {
  theme: Theme;
};

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const Item = styled(TabItem)`
  flex: 0 0 auto;
  margin-right: 1px;
`;

const TabContainer: React.FC<Props> = ({
  items,
  bufferedItems,
  selectedItem,
  onTabSelected,
  onCloseAllClicked,
  onCloseOthersClicked,
  onCloseRightsClicked,
  onCloseSavedClicked,
  onCloseThisClicked,
}) => {
  const [activatedTab, setActivatedTab] = useState<string | null>(null);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const hasSelected = items.find((w) => w.id === activatedTab);
    if (hasSelected) return;

    setActivatedTab(items[items.length - 1].id);
  }, [items]);

  useEffect(() => {
    setActivatedTab(selectedItem?.id || null);
  }, [selectedItem]);

  const getIsTabActivated = (item: FileItem) => {
    return activatedTab === item.id;
  };

  const getIsTabUnsaved = (item: FileItem) => {
    return !!bufferedItems?.find((w) => w.id === item.id);
  };

  const onTabClicked = (item: FileItem) => {
    setActivatedTab(item.id);
    if (onTabSelected) onTabSelected(item);
  };

  return (
    <Scroller>
      <ThemeContext.Consumer>
        {(theme) => (
          <Wrapper theme={theme}>
            {items.map((w) => (
              <Item
                key={w.id}
                item={w}
                isActivated={getIsTabActivated(w)}
                isShowUnsaved={getIsTabUnsaved(w)}
                onTabClicked={onTabClicked}
                onCloseAllClicked={onCloseAllClicked}
                onCloseOthersClicked={onCloseOthersClicked}
                onCloseRightsClicked={onCloseRightsClicked}
                onCloseSavedClicked={onCloseSavedClicked}
                onCloseThisClicked={onCloseThisClicked}
              />
            ))}
          </Wrapper>
        )}
      </ThemeContext.Consumer>
    </Scroller>
  );
};

export default TabContainer;
