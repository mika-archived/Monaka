import React, { useState } from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";
import styled from "styled-components";

import { FileItem } from "@/types";
import { CircleFilled, Close, DefaultFile } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import StyledContextMenu from "@/components/StyledContextMenu";
import { ThemeContext, Theme } from "@/components/ThemeProvider";

type Props = {
  className?: string;
  item: FileItem;
  isActivated: boolean;
  isShowUnsaved: boolean;
  onCloseAllClicked?: () => void;
  onCloseOthersClicked?: (item: FileItem) => void;
  onCloseRightsClicked?: (item: FileItem) => void;
  onCloseSavedClicked?: () => void;
  onCloseThisClicked?: (item: FileItem) => void;
  onTabClicked?: (item: FileItem) => void;
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

const TabItem: React.FC<Props> = ({
  className,
  item,
  isActivated,
  isShowUnsaved,
  onCloseAllClicked,
  onCloseOthersClicked,
  onCloseRightsClicked,
  onCloseSavedClicked,
  onCloseThisClicked,
  onTabClicked,
}) => {
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

    if (onCloseThisClicked) onCloseThisClicked(item);
  };

  const onClickCloseAll = () => {
    if (onCloseAllClicked) onCloseAllClicked();
  };

  const onClickCloseOthers = () => {
    if (onCloseOthersClicked) onCloseOthersClicked(item);
  };

  const onClickCloseRights = () => {
    if (onCloseRightsClicked) onCloseRightsClicked(item);
  };

  const onClickCloseSaved = () => {
    if (onCloseSavedClicked) onCloseSavedClicked();
  };

  const onClickCloseThis = () => {
    if (onCloseThisClicked) onCloseThisClicked(item);
  };

  const id = `TabItem-ContextMenu-${item.id}`;

  return (
    <>
      <StyledContextMenu id={id}>
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
                    <Icon>{getIconComponent(icons, item.title)}</Icon>
                    <Label>{item.title}</Label>
                    {getAttributeComponent(isActivated, isHovered, isShowUnsaved, onClickCloseButton)}
                  </TabContainer>
                )}
              </IconContext.Consumer>
            </TabWrapper>
          )}
        </ThemeContext.Consumer>
      </StyledContextMenu>
      <ContextMenu id={id}>
        <MenuItem onClick={onClickCloseThis} disabled={!onCloseThisClicked}>
          Close
        </MenuItem>
        <MenuItem onClick={onClickCloseOthers} disabled={!onCloseOthersClicked}>
          Close Others
        </MenuItem>
        <MenuItem onClick={onClickCloseRights} disabled={!onCloseRightsClicked}>
          Close to the Right
        </MenuItem>
        <MenuItem onClick={onClickCloseSaved} disabled={!onCloseSavedClicked}>
          Close Saved
        </MenuItem>
        <MenuItem onClick={onClickCloseAll} disabled={!onCloseAllClicked}>
          Close All
        </MenuItem>
      </ContextMenu>
    </>
  );
};

export default TabItem;
