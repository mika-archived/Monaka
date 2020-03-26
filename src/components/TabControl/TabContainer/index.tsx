import React, { useState } from "react";
import styled from "styled-components";

import { TabContent } from "@/types";
import Scroller from "@/components/Scroller";
import TabItem from "@/components/TabControl/TabItem";
import { ThemeContext, Theme } from "@/components/ThemeProvider";

type Props = {
  items: TabContent[];
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

const TabContainer: React.FC<Props> = ({ items, onTabClosed, onTabSelected }) => {
  const [activatedTab, setActivatedTab] = useState<string | null>(null);

  const getIsTabActivated = (item: TabContent) => {
    return activatedTab === item.item.id;
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
              <Item item={w} isActivated={getIsTabActivated(w)} onTabClicked={onTabClicked} onCloseButtonClicked={onTabClosed} />
            ))}
          </Wrapper>
        )}
      </ThemeContext.Consumer>
    </Scroller>
  );
};

export default TabContainer;
