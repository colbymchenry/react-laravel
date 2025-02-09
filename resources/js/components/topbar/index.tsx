"use client"

import { useAuth } from "@/stores/auth";
import { useDialog } from "@/stores/dialog";
import {
  Text,
  TopBar,
} from "@shopify/polaris";
import { ReturnIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";

export function AppTopbar() {
  const [searchValue, setSearchValue] = useState("");
  const [userMenuActive, setUserMenuActive] = useState(false);
  const { logout } = useAuth()
  const { addDialog } = useDialog()

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleUserMenuToggle = useCallback(() => {
    setUserMenuActive((active) => !active);
  }, []);

  const userMenuActions = [
    {
      items: [
        {
          content: "Sign out",
          icon: ReturnIcon,
          onAction: () => {
            addDialog({
              title: 'Logout',
              children: <Text as="p">Are you sure you want to logout?</Text>,
              primaryAction: {
                content: 'Yes, log me out',
                onAction: logout,
                destructive: true,
              },
              secondaryActions: [
                {
                  content: 'Nevermind',
                }
              ]
            })
          },
        },
      ],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name="User Name"
      detail="Business Name"
      initials="UN"
      open={userMenuActive}
      onToggle={handleUserMenuToggle}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchChange}
      value={searchValue}
      placeholder="Search"
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      searchField={window.location.pathname !== '/setup-openai' ? searchFieldMarkup : undefined}
    />
  );

  return topBarMarkup;
}