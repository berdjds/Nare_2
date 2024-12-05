"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from '@/components/language-switcher';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Plane,
  Building2,
  Calendar,
  Camera,
  Mountain,
  Globe,
  Briefcase,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  {
    trigger: 'services',
    href: '/services',
    content: [
      {
        title: 'tourPackages',
        icon: Plane,
        href: '/services/outgoing-packages'
      },
      {
        title: 'flightTickets',
        icon: Plane,
        href: '/services/air-tickets'
      },
      {
        title: 'visaServices',
        icon: Building2,
        href: '/services/visa-assistance'
      }
    ]
  },
  {
    trigger: 'armeniaTours',
    href: '/armenia-tours',
    content: [
      {
        title: 'dailyTours',
        icon: Calendar,
        href: '/armenia-tours/daily'
      },
      {
        title: 'culturalTours',
        icon: Camera,
        href: '/armenia-tours/cultural'
      },
      {
        title: 'adventureTours',
        icon: Mountain,
        href: '/armenia-tours/adventure'
      }
    ]
  },
  {
    trigger: 'b2bServices',
    href: '/b2b',
    content: [
      {
        title: 'dmcServices',
        icon: Globe,
        href: '/b2b/dmc'
      },
      {
        title: 'miceServices',
        icon: Briefcase,
        href: '/b2b/mice'
      }
    ]
  }
];

const ListItem = ({ className, title, href, icon: Icon, ...props }: any) => {
  const { t } = useLanguage();
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-blue-600" />}
            <div className="text-sm font-medium text-gray-900">
              {t(`menu.${title}`)}
            </div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1.5">
            {t(`menu.${title}Desc`)}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-gray-200/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-blue-600">Nare</span>
            <span className="text-orange-500">Travel</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-2">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.trigger}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuTrigger 
                      className="h-9 px-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-blue-600 data-[state=open]:bg-gray-100 data-[state=open]:text-blue-600"
                    >
                      {t(`menu.${item.trigger}`)}
                    </NavigationMenuTrigger>
                  </Link>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white rounded-lg border border-gray-200/20 shadow-lg">
                      {item.content.map((subItem) => (
                        <ListItem
                          key={subItem.title}
                          title={subItem.title}
                          href={subItem.href}
                          icon={subItem.icon}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <Link 
                  href="/about" 
                  className={cn(
                    "h-9 px-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-blue-600 rounded-md inline-flex items-center justify-center"
                  )}
                >
                  {t('menu.about')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link 
                  href="/contact" 
                  className={cn(
                    "h-9 px-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-blue-600 rounded-md inline-flex items-center justify-center"
                  )}
                >
                  {t('menu.contact')}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="h-5 w-[1px] bg-gray-200"></div>

          <LanguageSwitcher />
        </div>

        {/* Mobile Navigation */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden border-t border-gray-200/20 bg-white"
        >
          <div className="container py-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.trigger} className="space-y-2 py-2">
                <Link 
                  href={item.href}
                  className="block px-4 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 hover:text-blue-600"
                >
                  {t(`menu.${item.trigger}`)}
                </Link>
                <div className="pl-4 space-y-1">
                  {item.content.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="block px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 hover:text-blue-600"
                    >
                      {t(`menu.${subItem.title}`)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link 
              href="/about"
              className="block px-4 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 hover:text-blue-600"
            >
              {t('menu.about')}
            </Link>
            <Link 
              href="/contact"
              className="block px-4 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 hover:text-blue-600"
            >
              {t('menu.contact')}
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}