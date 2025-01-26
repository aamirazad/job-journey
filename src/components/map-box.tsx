"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { geocodeLocation } from "@/actions/actions";
import "mapbox-gl/dist/mapbox-gl.css";
import { FormError } from "./auth/form-error";

const queryClient = new QueryClient();

function Skeleton() {
  return <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200" />;
}

// Main App component to render the map
function App({ location }: { location: string }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["geo", location],
    queryFn: async () => {
      return await geocodeLocation(location); // Assuming this returns [longitude, latitude] or throws an error
    },
  });

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

    if (!data || "error" in data) {
      return;
    }

    if (data && !mapRef.current && mapContainerRef.current) {
      // Initialize the map only once when data is available
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current ?? undefined,
        center: data, // Starting position [lng, lat]
        zoom: 9, // Starting zoom
      });
      new mapboxgl.Marker().setLngLat(data).addTo(mapRef.current);
    }

    return () => {
      // Cleanup on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [data]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (!data || "error" in data) {
    return <FormError message="Map failed to load" />;
  }

  return (
    <div
      ref={mapContainerRef}
      className="map-container h-64 w-full rounded-lg"
    />
  );
}

// Wrapping component with QueryClientProvider, Suspense, and ErrorBoundary
export default function MapBoxLocation({ location }: { location: string }) {
  return (
    <QueryClientProvider client={queryClient}>
      <App location={location} />
    </QueryClientProvider>
  );
}
