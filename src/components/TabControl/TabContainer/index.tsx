import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { TabContent } from "@/types";
import Scroller from "@/components/Scroller";
import TabItem from "@/components/TabControl/TabItem";
import { ThemeContext, Theme } from "@/components/ThemeProvider";

type Props = {
  items: TabContent[];
  bufferedItems?: TabContent[] | null;
  selectedItem?: TabContent | null;
  onTabClosed?: (item: TabContent) => void;
  onTabSelected?: (item: TabContent) => void;
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

const TabContainer: React.FC<Props> = ({ items, bufferedItems, selectedItem, onTabClosed, onTabSelected }) => {
  const [activatedTab, setActivatedTab] = useState<string | null>(null);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const hasSelected = items.find((w) => w.item.id === activatedTab);
    if (hasSelected) return;

    setActivatedTab(items[items.length - 1].item.id);
  }, [items]);

  useEffect(() => {
    setActivatedTab(selectedItem?.item?.id || null);
  }, [selectedItem]);

  const getIsTabActivated = ({ item }: TabContent) => {
    return activatedTab === item.id;
  };

  const getIsTabUnsaved = ({ item }: TabContent) => {
    return !!bufferedItems?.find((w) => w.item.id === item.id);
  };

  const onTabClicked = (item: TabContent) => {
    setActivatedTab(item.item.id);
    if (onTabSelected) onTabSelected(item);
  };

  return (
    <Scroller>
      <ThemeContext.Consumer>
        {(theme) => (
          <Wrapper theme={theme}>
            {items.map((w) => (
              <Item key={w.item.id} item={w} isActivated={getIsTabActivated(w)} isShowUnsaved={getIsTabUnsaved(w)} onTabClicked={onTabClicked} onCloseButtonClicked={onTabClosed} />
            ))}
          </Wrapper>
        )}
      </ThemeContext.Consumer>
    </Scroller>
  );
};

export default TabContainer;
