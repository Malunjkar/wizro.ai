import { Search, Plus, ChevronDown, Folder } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function HrPerformanceUser() {
  const [isOpen, setIsOpen] = useState(false);

  const teamMembers = [
    {
      name: 'Nazneen Pinjari',
      role: 'founder',
      avatar: 'N',
      projects: 3,
      ratePerHour: '$0',
      email: 'nazneen.rauf@kosqu.com',
      permissionRole: 'Owner',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[var(--color-card)] border-b border-[var(--color-border)]">
        <h2 className="text-lg font-semibold">Team</h2>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-30 h-8 border border-[var(--color-border)] rounded-lg flex items-center justify-center hover:border-[var(--color-muted-foreground)] transition-colors">
              <Plus className="w-4 h-4 text-[var(--color-muted-foreground)]" /> Create User
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-foreground)] max-w-md p-0">
            {/* Modal Header */}
            <DialogHeader className="px-6 py-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">Create a project</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] h-6 w-6 p-0"
                />
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
                A project represents a team with its own tasks, workflows, and settings.
              </p>
            </DialogHeader>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Group of project */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] w-20 flex-shrink-0">
                  Group of project
                </span>
                <Button
                  variant="outline"
                  className="flex-1 justify-start bg-transparent border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                >
                  <Folder className="w-4 h-4 mr-2" />
                  Ungrouped
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-[var(--color-muted-foreground)] w-20 flex-shrink-0">
                  Status
                </span>
                <Badge className="bg-[var(--color-primary)] text-white px-3 py-1">TO DO</Badge>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[var(--color-border)] flex justify-end items-center">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                >
                  Cancel
                </Button>
                <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
                  Next step
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted-foreground)] h-4 w-4" />
              <Input
                placeholder="Employee search"
                className="pl-10 bg-[var(--color-input)] border-[var(--color-border)] text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4 text-sm text-[var(--color-muted-foreground)] font-medium mb-4">
            <div>Projects</div>
            <div>Tasks priority</div>
            <div>Rate per hour</div>
            <div>Contacts</div>
            <div>Permission role</div>
            <div></div>
          </div>
        </div>

        {/* Department */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <ChevronDown className="h-4 w-4 text-[var(--color-muted-foreground)]" />
            <span className="text-[var(--color-foreground)] font-medium">No department</span>
            <Badge variant="secondary" className="bg-[var(--color-muted)] text-[var(--color-muted-foreground)]">
              1
            </Badge>
          </div>

          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 items-center py-3 hover:bg-[var(--color-muted)] rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-sm font-medium text-[var(--color-primary-foreground)]">
                  {member.avatar}
                </div>
                <div>
                  <div className="text-[var(--color-foreground)] font-medium">{member.name}</div>
                  <div className="text-[var(--color-muted-foreground)] text-sm">{member.role}</div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
                  {member.projects}
                </Badge>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-destructive)]"></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--color-chart-4)]"></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--color-chart-2)]"></div>
                </div>
              </div>

              <div className="text-[var(--color-foreground)]">{member.ratePerHour}</div>
              <div className="text-[var(--color-muted-foreground)]">{member.email}</div>
              <div className="text-[var(--color-foreground)]">{member.permissionRole}</div>
              <div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
