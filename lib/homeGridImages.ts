/** Public URLs for home grid photos (`public/images/home-grid/`). Extra images stay off-grid and rotate in. */
export const HOME_GRID_IMAGE_PATHS = [
  "/images/home-grid/01.jpg",
  "/images/home-grid/02.jpg",
  "/images/home-grid/03.jpg",
  "/images/home-grid/04.jpg",
  "/images/home-grid/05.jpg",
  "/images/home-grid/06.jpg",
  "/images/home-grid/07.jpg",
  "/images/home-grid/08.jpg",
  "/images/home-grid/09.jpg",
  "/images/home-grid/10.jpg",
  "/images/home-grid/11.jpg",
  "/images/home-grid/12.jpg",
  "/images/home-grid/13.jpg",
  "/images/home-grid/14.jpg",
  "/images/home-grid/15.jpg",
] as const;

export type HomeGridImagePath = (typeof HOME_GRID_IMAGE_PATHS)[number];

export const HOME_GRID_COUNT = HOME_GRID_IMAGE_PATHS.length;

/** Deterministic first paint / hydration: first 9 images. */
export function getHomeGridInitialVisible(): HomeGridImagePath[] {
  return HOME_GRID_IMAGE_PATHS.slice(0, 9) as HomeGridImagePath[];
}
