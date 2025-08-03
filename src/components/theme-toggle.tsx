
"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex gap-1">
       <Button 
          variant={theme === 'light' ? 'default' : 'ghost'} 
          size="icon" 
          onClick={() => setTheme("light")}
          aria-label="Set light theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem]" />
       </Button>
       <Button 
          variant={theme === 'dark' ? 'default' : 'ghost'} 
          size="icon" 
          onClick={() => setTheme("dark")}
          aria-label="Set dark theme"
        >
          <Moon className="h-[1.2rem] w-[1.2rem]" />
       </Button>
       <Button 
          variant={theme === 'system' ? 'default' : 'ghost'} 
          size="icon" 
          onClick={() => setTheme("system")}
          aria-label="Set system theme"
        >
          <Monitor className="h-[1.2rem] w-[1.2rem]" />
       </Button>
    </div>
  )
}
