import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import {cn } from "../../lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
       "inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-gray-100 p-1 shadow ring-1 ring-gray-200",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold",
        "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
        "data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:ring-2 data-[state=active]:ring-blue-300",
        "transition-colors focus-visible:outline-1 focus-visible:outline-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-300/60",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
