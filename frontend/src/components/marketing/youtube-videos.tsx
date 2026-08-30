import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { socialLinks, youtubeVideos } from "@/lib/content";

export function YoutubeVideoGrid({ limit = 6 }: { limit?: number }) {
  const videos = youtubeVideos.slice(0, limit);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, i) => (
          <Reveal key={video.id} delay={i * 0.05}>
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-2xl bg-navy soft-shadow transition hover:scale-[1.015] active:scale-[0.99]"
            >
              <div className="aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg transition group-hover:scale-110">
                  <Play className="h-5 w-5 fill-current" />
                </span>
              </div>
              <p className="absolute bottom-0 left-0 right-0 p-3 pb-3.5 text-sm font-medium leading-normal text-white line-clamp-2">
                {video.title}
              </p>
            </a>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6 text-center">
        <Button asChild variant="outline">
          <a href={socialLinks.youtube} target="_blank" rel="noreferrer">
            More on YouTube
          </a>
        </Button>
      </Reveal>
    </div>
  );
}
