"use client";

import React from "react";
import { Scene01TrendBars } from "./Scene01TrendBars";
import { Scene02SegmentedPricing } from "./Scene02SegmentedPricing";
import { Scene03LogoAssembly } from "./Scene03LogoAssembly";
import { Scene04LiveActivityPill } from "./Scene04LiveActivityPill";
import { Scene05ResultsFunnel } from "./Scene05ResultsFunnel";
import { Scene06ButtonCompletion } from "./Scene06ButtonCompletion";
import { Scene07ConfirmationCard } from "./Scene07ConfirmationCard";
import { Scene08RollingCounter } from "./Scene08RollingCounter";
import { Scene09VariableTypography } from "./Scene09VariableTypography";
import { Scene10InterfaceReveal } from "./Scene10InterfaceReveal";
import { Scene11CalendarAutomation } from "./Scene11CalendarAutomation";
import { Scene12NotificationStack } from "./Scene12NotificationStack";
import { Scene13ActivityRings } from "./Scene13ActivityRings";
import { Scene14ProductCard3D } from "./Scene14ProductCard3D";

export type SceneCategory =
  | "all"
  | "data-growth"
  | "product-ui"
  | "brand-automation";

export interface SceneRegistryItem {
  sceneNumber: number;
  id: string;
  title: string;
  category: "data-growth" | "product-ui" | "brand-automation";
  heroObjectDescription: string;
  referencePayoffLabel: string;
  domainAdaptation: string;
  render: (props?: { showFrame?: boolean; time?: number; className?: string }) => React.ReactNode;
}

export const SCENE_REGISTRY: readonly SceneRegistryItem[] = [
  {
    sceneNumber: 1,
    id: "scene-01",
    title: "Bars That Turn Into a Trend",
    category: "data-growth",
    heroObjectDescription: "Seven vertical precision rounded bars with spring overshoot and glowing cubic spline.",
    referencePayoffLabel: "+200% Weekly Sign-ups",
    domainAdaptation: "CleanFanatics Acquisition Velocity",
    render: (props) => <Scene01TrendBars {...props} />,
  },
  {
    sceneNumber: 2,
    id: "scene-02",
    title: "Segmented Pricing Control",
    category: "product-ui",
    heroObjectDescription: "iOS-style frosted segmented pill sliding above a tier card with mechanical price odometer.",
    referencePayoffLabel: "$119/mo (Save 20%)",
    domainAdaptation: "SaaS & Tier Architecture",
    render: (props) => <Scene02SegmentedPricing {...props} />,
  },
  {
    sceneNumber: 3,
    id: "scene-03",
    title: "Logo Assembly",
    category: "brand-automation",
    heroObjectDescription: "120 glossy 3D spheres swirling inward along vortex spirals into Arjun's architectural mark.",
    referencePayoffLabel: "Arjun Systems Monogram",
    domainAdaptation: "Brand & Engineering Mark",
    render: (props) => <Scene03LogoAssembly {...props} />,
  },
  {
    sceneNumber: 4,
    id: "scene-04",
    title: "Live Activity Pill",
    category: "brand-automation",
    heroObjectDescription: "Upper hardware bezel pill expanding with spring physics into a live broadcast activity card.",
    referencePayoffLabel: "LIVE · Webinar Starts Now",
    domainAdaptation: "Event-Driven Pipeline",
    render: (props) => <Scene04LiveActivityPill {...props} />,
  },
  {
    sceneNumber: 5,
    id: "scene-05",
    title: "3D Results Funnel",
    category: "data-growth",
    heroObjectDescription: "3-tier translucent frosted glass funnel with 96 converging data particles.",
    referencePayoffLabel: "600 Qualified Sales",
    domainAdaptation: "Full-Funnel Conversion",
    render: (props) => <Scene05ResultsFunnel {...props} />,
  },
  {
    sceneNumber: 6,
    id: "scene-06",
    title: "Button to Completion",
    category: "product-ui",
    heroObjectDescription: "Tactile glossy button clicked by vector cursor, morphing to progress ring and green Published badge.",
    referencePayoffLabel: "Published · Release #408",
    domainAdaptation: "Release & Deployment Engine",
    render: (props) => <Scene06ButtonCompletion {...props} />,
  },
  {
    sceneNumber: 7,
    id: "scene-07",
    title: "Confirmation & Deployment Card",
    category: "product-ui",
    heroObjectDescription: "Elevated frosted wallet card with orbiting light ring locking into a green Verified medallion.",
    referencePayoffLabel: "Verified · $1,240.00",
    domainAdaptation: "Payment & Settlement Protocol",
    render: (props) => <Scene07ConfirmationCard {...props} />,
  },
  {
    sceneNumber: 8,
    id: "scene-08",
    title: "Rolling Metric Counter",
    category: "data-growth",
    heroObjectDescription: "Mechanical 5-column digit odometer inside convex cylinder optical shadow.",
    referencePayoffLabel: "12,480 Subscribers (+18%)",
    domainAdaptation: "GA4 & Mixpanel Telemetry",
    render: (props) => <Scene08RollingCounter {...props} />,
  },
  {
    sceneNumber: 9,
    id: "scene-09",
    title: "Variable Typography",
    category: "brand-automation",
    heroObjectDescription: "Editorial headline 'Make it move.' transitioning from thin 200 to heavy 900 with bouncing coral period.",
    referencePayoffLabel: "Make it move. (900 wght)",
    domainAdaptation: "Kinetic Editorial Design",
    render: (props) => <Scene09VariableTypography {...props} />,
  },
  {
    sceneNumber: 10,
    id: "scene-10",
    title: "App Interface Reveal",
    category: "product-ui",
    heroObjectDescription: "Architectural blueprint wireframe wiped top-to-bottom by a laser bar to reveal Daily Focus dashboard.",
    referencePayoffLabel: "Daily Focus (92% Ring)",
    domainAdaptation: "Product Design Systems",
    render: (props) => <Scene10InterfaceReveal {...props} />,
  },
  {
    sceneNumber: 11,
    id: "scene-11",
    title: "Calendar Automation",
    category: "brand-automation",
    heroObjectDescription: "Animated cursor dragging an unscheduled block and snapping it into an open Thursday 11:00 slot.",
    referencePayoffLabel: "Thursday 11:00 · Call with Sam",
    domainAdaptation: "Operations & Booking Grid",
    render: (props) => <Scene11CalendarAutomation {...props} />,
  },
  {
    sceneNumber: 12,
    id: "scene-12",
    title: "Notification Stack",
    category: "brand-automation",
    heroObjectDescription: "Real-time incoming orders arriving with spring physics into a 3D perspective pile.",
    referencePayoffLabel: "12 New Orders Active",
    domainAdaptation: "Real-time Order Ingestion",
    render: (props) => <Scene12NotificationStack {...props} />,
  },
  {
    sceneNumber: 13,
    id: "scene-13",
    title: "Concentric Activity Rings",
    category: "data-growth",
    heroObjectDescription: "Three concentric rings in coral, green, and blue sweeping clockwise to 100% triple closure.",
    referencePayoffLabel: "Goal hit. (3/3 Tracks)",
    domainAdaptation: "Multi-Track Systems Velocity",
    render: (props) => <Scene13ActivityRings {...props} />,
  },
  {
    sceneNumber: 14,
    id: "scene-14",
    title: "3D Product Card",
    category: "product-ui",
    heroObjectDescription: "Spatial card rotating 360° in true perspective, cascading 3 reverse ticks and £129 hero display.",
    referencePayoffLabel: "Studio Pro · £129",
    domainAdaptation: "3D E-Commerce & Systems",
    render: (props) => <Scene14ProductCard3D {...props} />,
  },
] as const;
