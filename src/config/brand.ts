const rawName = (import.meta.env.VITE_BRAND_NAME as string | undefined)?.trim()
const rawLogo = (import.meta.env.VITE_BRAND_LOGO as string | undefined)?.trim()
const rawTagline = (import.meta.env.VITE_BRAND_TAGLINE as string | undefined)?.trim()

export const brand = {
  name: rawName && rawName.length > 0 ? rawName : "Galani",
  logoSrc: rawLogo && rawLogo.length > 0 ? rawLogo : "/galani.jpg",
  tagline: rawTagline && rawTagline.length > 0 ? rawTagline : "Built for a polished desktop and mobile experience.",
} as const

export type BrandConfig = typeof brand
