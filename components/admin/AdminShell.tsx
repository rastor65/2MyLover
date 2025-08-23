"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Menu,
    LayoutGrid,
    Package,
    FolderTree,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ")
}

function NavItem({
    href,
    label,
    icon,
    active,
    collapsed,
}: {
    href: string
    label: string
    icon: React.ReactNode
    active?: boolean
    collapsed?: boolean
}) {
    return (
        <Link
            href={href}
            className={cx(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-black text-white shadow-sm" : "hover:bg-gray-100 text-gray-800"
            )}
            title={collapsed ? label : undefined}
        >
            <span className="shrink-0">{icon}</span>
            <span
                className={cx(
                    "truncate transition-[opacity,transform]",
                    collapsed && "opacity-0 -translate-x-2 pointer-events-none"
                )}
            >
                {label}
            </span>
        </Link>
    )
}

export default function AdminShell({
    children,
    userEmail,
    role,
}: {
    children: React.ReactNode
    userEmail: string
    role: "viewer" | "editor" | "admin" | "superadmin"
}) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState<boolean>(false)
    const [mobileOpen, setMobileOpen] = useState<boolean>(false)

    // Anchuras del sidebar
    const EXPANDED = 240
    const COLLAPSED = 72
    const sidebarWidth = collapsed ? COLLAPSED : EXPANDED

    // Gutter extra entre sidebar y contenido
    const CONTENT_GUTTER = 24 // px

    // Posición del botón flotante (ligeramente "dentro" del borde)
    const toggleLeft = (collapsed ? COLLAPSED : EXPANDED) - 12

    useEffect(() => {
        const saved = localStorage.getItem("admin_sidebar_collapsed")
        if (saved === "1") setCollapsed(true)
    }, [])
    useEffect(() => {
        localStorage.setItem("admin_sidebar_collapsed", collapsed ? "1" : "0")
    }, [collapsed])

    // Atajo Ctrl/Cmd + B
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                e.preventDefault()
                setCollapsed((s) => !s)
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    const active = useMemo(() => {
        return {
            dashboard: pathname === "/admin",
            products: pathname.startsWith("/admin/products"),
            categories: pathname.startsWith("/admin/categories"),
        }
    }, [pathname])

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Sidebar fijo (desktop) */}
            <aside
                className={cx(
                    "fixed inset-y-0 left-0 z-40 hidden md:flex flex-col border-r bg-white shadow-sm transition-[width] duration-300 overflow-hidden"
                )}
                style={{ width: sidebarWidth }}
            >
                {/* Brand (2MyLover expandido / 2ML colapsado con ancho fijo) */}
                <div className="flex items-center justify-between px-3 py-3 border-b">
                    <Link href="/admin" aria-label={collapsed ? "2ML" : "2MyLover"}>
                        {/* Reservamos espacio fijo para que no cambie el alto ni ancho */}
                        <div className="relative h-6 w-28">
                            {/* Versión expandida */}
                            <span
                                className={[
                                    "absolute inset-0 flex items-center font-semibold tracking-tight transition",
                                    collapsed ? "opacity-0 -translate-x-2 pointer-events-none" : "opacity-100 translate-x-0",
                                ].join(" ")}
                            >
                                2MyLover
                            </span>
                            {/* Versión colapsada */}
                            <span
                                className={[
                                    "absolute inset-0 flex items-center font-semibold tracking-tight transition",
                                    collapsed ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none",
                                ].join(" ")}
                            >
                                2ML
                            </span>
                        </div>
                    </Link>

                    {/* (opcional) Botón inline; el FAB externo sigue funcionando */}
                    <button
                        aria-label="Alternar sidebar"
                        className="hidden rounded-lg border px-2 py-1.5 text-xs hover:bg-gray-50 md:inline-flex"
                        onClick={() => setCollapsed((s) => !s)}
                        title="Ctrl/Cmd + B"
                    >
                        {collapsed ? "»" : "«"}
                    </button>
                </div>

                {/* Nav */}
                <nav className="p-3 space-y-1">
                    <NavItem
                        href="/admin"
                        label="Dashboard"
                        icon={<LayoutGrid className="h-4 w-4" />}
                        active={active.dashboard}
                        collapsed={collapsed}
                    />
                    <NavItem
                        href="/admin/products"
                        label="Productos"
                        icon={<Package className="h-4 w-4" />}
                        active={active.products}
                        collapsed={collapsed}
                    />
                    <NavItem
                        href="/admin/categories"
                        label="Categorías"
                        icon={<FolderTree className="h-4 w-4" />}
                        active={active.categories}
                        collapsed={collapsed}
                    />
                </nav>

                {/* Footer del sidebar */}
                <div className="mt-auto p-3 border-t text-[11px] ">
                    <div
                        className={cx(
                            "transition",
                            collapsed && "opacity-0 -translate-x-2"
                        )}
                    >
                        © {new Date().getFullYear()} 2MyLover
                    </div>
                </div>
            </aside>

            {/* Botón flotante expandir/colapsar (desktop) */}
            <button
                type="button"
                aria-label={collapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
                title="Ctrl/Cmd + B"
                onClick={() => setCollapsed((s) => !s)}
                className={cx(
                    "hidden md:flex items-center justify-center",
                    "fixed top-1/2 -translate-y-1/2 z-50",
                    "h-8 w-8 rounded-full border bg-white shadow hover:bg-gray-50"
                )}
                style={{ left: toggleLeft }}
            >
                {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </button>

            {/* Topbar con altura fija */}
            <header
                className="fixed top-0 z-30 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 h-14"
                style={{ left: 0, right: 0 }}
            >
                <div className="h-full w-full px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            className="md:hidden rounded-lg border px-2.5 py-2 hover:bg-gray-50"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Abrir menú"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <Link href="/admin" className="text-base font-semibold tracking-tight">
                            2ML
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:block text-xs text-muted-foreground">
                            {userEmail} · Rol: {role}
                        </span>
                    </div>
                </div>
            </header>

            {/* Drawer móvil */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <span className="font-semibold">Menú</span>
                            <button
                                className="rounded-lg border px-2 py-1.5 text-xs hover:bg-gray-50"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Cerrar menú"
                            >
                                ✕
                            </button>
                        </div>
                        <nav className="p-3 space-y-1">
                            <Link
                                className={cx(
                                    "block rounded-lg px-3 py-2 text-sm hover:bg-gray-100",
                                    pathname === "/admin" && "bg-black text-white"
                                )}
                                href="/admin"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <LayoutGrid className="h-4 w-4" /> Dashboard
                                </span>
                            </Link>
                            <Link
                                className={cx(
                                    "block rounded-lg px-3 py-2 text-sm hover:bg-gray-100",
                                    pathname.startsWith("/admin/products") && "bg-black text-white"
                                )}
                                href="/admin/products"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <Package className="h-4 w-4" /> Productos
                                </span>
                            </Link>
                            <Link
                                className={cx(
                                    "block rounded-lg px-3 py-2 text-sm hover:bg-gray-100",
                                    pathname.startsWith("/admin/categories") && "bg-black text-white"
                                )}
                                href="/admin/categories"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <FolderTree className="h-4 w-4" /> Categorías
                                </span>
                            </Link>
                        </nav>
                        <div className="mt-auto p-4 border-t text-xs text-muted-foreground">
                            {userEmail} · Rol: {role}
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN */}
            <main className="relative" style={{ paddingTop: 64 }}>
                {/* Empujamos el contenido en desktop con un gutter adicional */}
                <div
                    className="px-4 pb-10 md:pl-0"
                    style={{ paddingLeft: sidebarWidth + CONTENT_GUTTER }}
                >
                    <div className="pt-4">{children}</div>
                </div>
            </main>
        </div>
    )
}
