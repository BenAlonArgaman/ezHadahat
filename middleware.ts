import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// });

export default authMiddleware({
  publicRoutes: ["/api/:path*", "/api/sT4OusqKVpGNcN1LBuyy/products"],
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
