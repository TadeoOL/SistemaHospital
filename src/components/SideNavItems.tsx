import { Box, ButtonBase, Collapse, Stack } from "@mui/material";
import { IModuleItems } from "../types/types";
import { useNavigate } from "react-router-dom";
import { useChildrenNavItems } from "../store/childrenNavItems";
import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface ISideNavItems extends IModuleItems {
  active: boolean;
  disabled: boolean;
}

export const SideNavItems = (props: ISideNavItems) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          ...(props.active && {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }),
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          },
          borderRadius: 1,
        }}
      >
        <ButtonBase
          onClick={() => {
            props.active && props.childrenItems.length === 0
              ? navigate(props.path)
              : setIsOpen(!isOpen);
          }}
          sx={{
            alignItems: "center",
            borderRadius: 1,
            display: "flex",
            justifyContent: "flex-start",
            pl: "16px",
            pr: "16px",
            py: "6px",
            textAlign: "left",
            width: "100%",
          }}
        >
          {props.icon && (
            <Box
              component="span"
              sx={{
                alignItems: "center",
                color: "neutral.400",
                display: "inline-flex",
                justifyContent: "center",
                mr: 2,
                ...(props.active && {
                  color: "primary.main",
                }),
              }}
            >
              {props.icon}
            </Box>
          )}
          <Box
            component="span"
            sx={{
              color: "neutral.400",
              flexGrow: 1,
              fontFamily: (theme) => theme.typography.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "24px",
              whiteSpace: "nowrap",
              ...(props.active && {
                color: "common.white",
              }),
              ...(props.disabled && {
                color: "neutral.500",
              }),
            }}
          >
            {props.title}
          </Box>
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: "neutral.400",
              display: "inline-flex",
              justifyContent: "center",
              transition: "color 0.3s ease-in-out",
              ...(props.active && {
                color: "primary.main",
              }),
            }}
          >
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </ButtonBase>
        {props.childrenItems.length === 0 ? null : (
          <Collapse in={isOpen}>
            {props.childrenItems.map((childItem) => {
              const isActive =
                childItem.path === location.pathname ? true : false;
              return (
                <Stack>
                  <ButtonBase
                    onClick={() => navigate(childItem.path)}
                    sx={{
                      ...(isActive && {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      }),
                      alignItems: "center",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      pl: "28px",
                      pr: "16px",
                      py: "6px",
                      textAlign: "left",
                      width: "100%",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                      },
                    }}
                  >
                    {childItem.icon && (
                      <Box
                        component="span"
                        sx={{
                          alignItems: "center",
                          color: "neutral.400",
                          display: "inline-flex",
                          justifyContent: "center",
                          mr: 2,
                          ...(props.active && {
                            color: "primary.main",
                          }),
                        }}
                      >
                        {childItem.icon}
                      </Box>
                    )}
                    <Box
                      component="span"
                      sx={{
                        color: "neutral.400",
                        flexGrow: 1,
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: "24px",
                        whiteSpace: "nowrap",
                        ...(props.active && {
                          color: "common.white",
                        }),
                        ...(props.disabled && {
                          color: "neutral.500",
                        }),
                      }}
                    >
                      {childItem.title}
                    </Box>
                  </ButtonBase>
                </Stack>
              );
            })}
          </Collapse>
        )}
      </Box>
    </li>
  );
};
