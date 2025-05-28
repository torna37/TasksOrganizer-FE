import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ListOrdered, Plus } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { TaskList } from "@/types/models";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/use-auth";
import { useGetAllTaskLists } from "@/services/api/taskListApi";

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const { data: taskLists, isLoading, error } = useGetAllTaskLists();

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold px-2">
          TaskFlow
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/"}
              tooltip="Dashboard"
            >
              <Link to="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === "/all-tasks"}
              tooltip="All Tasks"
            >
              <Link to="/all-tasks">
                <ListOrdered />
                <span>All Tasks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-3 mt-6 mb-2 flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground">
            Your Lists
          </h3>
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              document.dispatchEvent(new CustomEvent("open-create-list"));
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
          </Link>
        </div>

        <SidebarMenu>
          {taskLists.map((list) => (
            <SidebarMenuItem key={list.id}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === `/task-list/${list.id}`}
                tooltip={list.name}
              >
                <Link to={`/task-list/${list.id}`}>
                  <span>{list.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-row justify-between items-center p-2 gap-2">
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={logout}>
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
