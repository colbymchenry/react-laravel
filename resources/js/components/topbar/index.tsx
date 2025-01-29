"use client"

import { useAuth } from "@/stores/auth";
import {
  TopBar,
} from "@shopify/polaris";
import { ReturnIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";

export function AppTopbar() {
  const [searchValue, setSearchValue] = useState("");
  const [userMenuActive, setUserMenuActive] = useState(false);
  const { logout } = useAuth()

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
            logout()
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
      searchField={searchFieldMarkup}
    />
  );

  return topBarMarkup;
}