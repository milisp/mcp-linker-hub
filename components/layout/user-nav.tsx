"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, LogOut, Settings, Star, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupabase } from "../providers/supabase-provider";

export function UserNav() {
  const { session, supabase } = useSupabase();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (!session) return null;

  const user = session.user;
  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : "U";

  // Define menu items to avoid repetition
  const menuItems = [
    {
      label: "Profile",
      icon: User,
      path: "/account/profile",
    },
    {
      label: "Favorites",
      icon: Heart,
      path: "/favorites",
    },
    {
      label: "My Servers",
      icon: Star,
      path: "/my-servers",
    },
    {
      label: "Team",
      icon: Users,
      path: "/teams",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url || ""}
              alt={user.email || ""}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Render menu items dynamically */}
          {menuItems.map(({ label, icon: Icon, path }) => (
            <DropdownMenuItem key={label} onClick={() => router.push(path)}>
              <Icon className="mr-2 h-4 w-4" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
