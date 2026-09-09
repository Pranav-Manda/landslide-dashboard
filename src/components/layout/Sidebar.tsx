import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CloudRain,
  LayoutDashboard,
  Map,
  MapPin,
  PlayCircle,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "../../store/appStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isHome?: boolean;
}

export default function Sidebar({
  isOpen,
  onClose,
  isHome = false,
}: SidebarProps) {
  const location = useLocation();
  const { alerts } = useAppStore();

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "ACTIVE"
  );

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Risk Map",
      path: "/map",
      icon: Map,
    },
    {
      label: "Locations",
      path: "/locations",
      icon: MapPin,
    },
    {
      label: "AI Analysis",
      path: "/",
      icon: Activity,
    },
    {
      label: "Simulation Center",
      path: "/simulation",
      icon: ShieldAlert,
    },
    {
      label: "Demo Mode",
      path: "/demo",
      icon: PlayCircle,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      label: "Alert Center",
      path: "/alerts",
      icon: Bell,
      badge: activeAlerts.length,
    },
    {
      label: "Monitoring Stations",
      path: "/stations",
      icon: Activity,
    },
    {
      label: "Weather",
      path: "/weather",
      icon: CloudRain,
    },
    {
      label: "Public Warning",
      path: "/public-warning",
      icon: AlertTriangle,
    },
  ];

  return (
    <>
      {/* Dark overlay for mobile/drawer mode */}
      {!isHome && isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`app-sidebar ${
          isHome
            ? "sidebar-home"
            : isOpen
            ? "sidebar-open"
            : "sidebar-closed"
        }`}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div>
            <div className="logo-mark">
              LW
            </div>
          </div>

          <div className="logo-text">
            <strong>LANDWATCH</strong>
            <span>EARLY WARNING SYSTEM</span>
          </div>

          {!isHome && (
            <button
              className="sidebar-close"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">

          <div className="sidebar-section-title">
            MONITORING
          </div>

          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`nav-item ${
                  isActive(item.path)
                    ? "nav-item-active"
                    : ""
                }`}
              >
                <Icon size={18} />

                <span>{item.label}</span>

                {item.badge !== undefined &&
                  item.badge > 0 && (
                    <span className="nav-alert-count">
                      {item.badge}
                    </span>
                  )}
              </Link>
            );
          })}

          <div className="sidebar-section-title">
            ANALYSIS
          </div>

          {navItems.slice(4, 7).map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`nav-item ${
                  isActive(item.path)
                    ? "nav-item-active"
                    : ""
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="sidebar-section-title">
            ALERTS & DATA
          </div>

          {navItems.slice(7).map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={`nav-item ${
                  isActive(item.path)
                    ? "nav-item-active"
                    : ""
                }`}
              >
                <Icon size={18} />

                <span>{item.label}</span>

                {item.badge !== undefined &&
                  item.badge > 0 && (
                    <span className="nav-alert-count">
                      {item.badge}
                    </span>
                  )}
              </Link>
            );
          })}

          <div className="sidebar-section-title">
            SYSTEM
          </div>

          <Link
            to="/settings"
            onClick={onClose}
            className={`nav-item ${
              isActive("/settings")
                ? "nav-item-active"
                : ""
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Bottom status */}
        <div className="sidebar-status">
          <div className="status-dot" />

          <div>
            <strong>System Online</strong>
            <span>Prototype monitoring active</span>
          </div>
        </div>
      </aside>
    </>
  );
}