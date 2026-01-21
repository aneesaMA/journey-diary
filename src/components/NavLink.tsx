import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface NavLinkProps extends Omit<RouterNavLinkProps, 'className' | 'children'> {
  className?: string;
  activeClassName?: string;
  children: ReactNode | ((props: { isActive: boolean }) => ReactNode);
}

export function NavLink({ className, activeClassName, children, ...props }: NavLinkProps) {
  return (
    <RouterNavLink
      className={({ isActive }) => cn(className, isActive && activeClassName)}
      {...props}
    >
      {({ isActive }) => (
        typeof children === 'function' ? children({ isActive }) : children
      )}
    </RouterNavLink>
  );
}
