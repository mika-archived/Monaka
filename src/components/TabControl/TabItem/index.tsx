import React, { useState } from "react";
import styled from "styled-components";

import { TabContent } from "@/types";
import { CircleFilled, Close, DefaultFile } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import { ThemeContext, Theme } from "@/components/ThemeProvider";

type Props = {
  className?: string;
  item: TabContent;
  isActivated: boolean;
  isShowUnsaved: boolean;
  onCloseButtonClicked?: (item: TabContent) => void;
  onTabClicked?: (item: TabContent) => void;
};

type TabWrapperProps = {
  isActivated: boolean;
  theme: Theme;
};

const TabWrapper = styled.div<TabWrapperProps>`
  display: inline-block;
  min-width: 150px;
  padding: 8px 16px;
  overflow: hidden;
  color: ${(props) => (props.isActivated ? props.theme.activeFontColor : props.theme.fontColor)};
  text-overflow: ellipsis;
  user-select: none;
  background-color: ${(props) => (props.isActivated ? props.theme.activeBackground : props.theme.inactiveBackground)};
`;

const TabContainer = styled.div`
  display: flex;
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;
`;

const Label = styled.span`
  flex: 1 1 auto;
  padding-left: 8px;
  font-size: 14px;
  white-space: nowrap;
`;

const CloseButton = styled(Close)`
  padding: 2px 4px;
`;

const EmptySpace = styled.div`
  width: 24px;
`;

const UnsavedButton = styled(CircleFilled)`
  padding: 2px 4px;
`;

const TabItem: React.FC<Props> = ({ className, item, isActivated, isShowUnsaved, onCloseButtonClicked, onTabClicked }) => {
  const [isHovered, setHovered] = useState(false);

  const getIconComponent = (icons: { extension: RegExp; component: React.FC<any> }[], filename: string) => {
    const icon = icons.find((w) => w.extension.test(filename));
    const Component = icon ? icon.component : DefaultFile;

    return <Component />;
  };

  const getAttributeComponent = (activated: boolean, hovered: boolean, unsaved: boolean, onClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void) => {
    if (unsaved) {
      return hovered ? <CloseButton onClick={onClick} /> : <UnsavedButton onClick={onClick} />;
    }

    return activated || hovered ? <CloseButton onClick={onClick} /> : <EmptySpace />;
  };

  const onClickTabWrapper = () => {
    if (onTabClicked) onTabClicked(item);
  };

  const onClickCloseButton = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();

    if (onCloseButtonClicked) onCloseButtonClicked(item);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <TabWrapper
          className={className}
          isActivated={isActivated}
          theme={theme}
          onClick={onClickTabWrapper}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <IconContext.Consumer>
            {(icons) => (
              <TabContainer>
                <Icon>{getIconComponent(icons, item.item.title)}</Icon>
                <Label>{item.item.title}</Label>
                {getAttributeComponent(isActivated, isHovered, isShowUnsaved, onClickCloseButton)}
              </TabContainer>
            )}
          </IconContext.Consumer>
        </TabWrapper>
      )}
    </ThemeContext.Consumer>
  );
};

export default TabItem;
