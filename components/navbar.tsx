"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
            {Icon && <Icon className="h-4 w-4 text-primary" />}
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
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>
      
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-gray-200/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center group">
          <div className="relative h-16 w-40 flex-shrink-0">
            <Image 
              src="/logo/Nare_logo_menu_web.webp" 
              alt="Nare Travel and Tours"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="160px"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-2">
              <NavigationMenuItem>
                <Link 
                  href="/" 
                  className={cn(
                    "h-9 px-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-primary bg-white/50 rounded-md inline-flex items-center justify-center border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    pathname === '/' && "bg-primary text-white hover:bg-primary hover:text-white"
                  )}
                  aria-current={pathname === '/' ? 'page' : undefined}
                >
                  {t('menu.home')}
                </Link>
              </NavigationMenuItem>
              {menuItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                return (
                <NavigationMenuItem key={item.trigger}>
                  <NavigationMenuTrigger 
                    className={cn(
                      "h-9 px-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-primary bg-white/50 rounded-md border border-gray-200/50 data-[state=open]:bg-primary data-[state=open]:text-white",
                      isActive && "bg-primary text-white hover:bg-primary hover:text-white"
                    )}
                  >
                    {t(`menu.${item.trigger}`)}
                  </NavigationMenuTrigger>
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
                );
              })}
              <NavigationMenuItem>
                <Link 
                  href="/insights" 
                  className={cn(
                    "h-9 px-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-primary bg-white/50 rounded-md inline-flex items-center justify-center border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    pathname === '/insights' && "bg-primary text-white hover:bg-primary hover:text-white"
                  )}
                  aria-current={pathname === '/insights' ? 'page' : undefined}
                >
                  {t('menu.insights')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link 
                  href="/about" 
                  className={cn(
                    "h-9 px-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-primary bg-white/50 rounded-md inline-flex items-center justify-center border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    pathname === '/about' && "bg-primary text-white hover:bg-primary hover:text-white"
                  )}
                  aria-current={pathname === '/about' ? 'page' : undefined}
                >
                  {t('menu.about')}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link 
                  href="/contact" 
                  className={cn(
                    "h-9 px-4 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-primary bg-white/50 rounded-md inline-flex items-center justify-center border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    pathname === '/contact' && "bg-primary text-white hover:bg-primary hover:text-white"
                  )}
                  aria-current={pathname === '/contact' ? 'page' : undefined}
                >
                  {t('menu.contact')}
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="h-5 w-[1px] bg-gray-200"></div>

          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
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
            <Link 
              href="/"
              className="block px-4 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 hover:text-blue-600"
            >
              {t('menu.home')}
            </Link>
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
              href="/insights"
              className="block px-4 py-2 text-sm font-medium text-gray-900 rounded-md hover:bg-gray-100 hover:text-blue-600"
            >
              {t('menu.insights')}
            </Link>
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
    </>
  );
}