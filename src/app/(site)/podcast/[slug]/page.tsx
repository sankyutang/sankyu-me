import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichTextRenderer } from "@/components/rich-text";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/separator";
import { getMediaUrl } from "@/lib/media";
import { getPayloadClient } from "@/lib/payload";

type Props = { params: Promise<{ slug: string }> };

export default async function PodcastEpisodePage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const res = await payload.find({
    collection: "podcasts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  const ep = res.docs[0];
  if (!ep || ep.status !== "published") {
    notFound();
  }

  const cover = getMediaUrl(typeof ep.coverImage === "object" ? ep.coverImage : null);
  const audioFromUpload = getMediaUrl(typeof ep.audioFile === "object" ? ep.audioFile : null);
  const audioSrc = ep.audioUrl || audioFromUpload;

  const date =
    ep.publishedAt != null
      ? new Date(ep.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <header className="space-y-2">
        <div className="text-muted-foreground flex flex-wrap gap-3 text-sm">
          {date ? <time dateTime={ep.publishedAt || undefined}>{date}</time> : null}
          {ep.duration ? <span>{ep.duration}</span> : null}
        </div>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{ep.title}</h1>
        {ep.excerpt ? <p className="text-muted-foreground text-lg">{ep.excerpt}</p> : null}
      </header>

      {cover ? (
        <div className="bg-muted relative mt-8 aspect-square w-full max-w-md overflow-hidden rounded-xl sm:aspect-video">
          <Image src={cover} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 448px" />
        </div>
      ) : null}

      {audioSrc ? (
        <div className="mt-8">
          <audio controls className="w-full" src={audioSrc}>
            <track kind="captions" />
          </audio>
        </div>
      ) : null}

      {ep.externalLinks && ep.externalLinks.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {ep.externalLinks.map((l: { platform: string; url: string }, i: number) => (
            <Link
              key={i}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {l.platform}
            </Link>
          ))}
        </div>
      ) : null}

      {ep.showNotes ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Show notes</h2>
          <div className="mt-4">
            <RichTextRenderer data={ep.showNotes} />
          </div>
        </section>
      ) : null}

      {ep.content ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Episode</h2>
          <div className="mt-4">
            <RichTextRenderer data={ep.content} />
          </div>
        </section>
      ) : null}

      <Separator className="my-12" />

      <p className="text-sm">
        <Link href="/podcast" className="text-muted-foreground hover:text-foreground underline">
          ← All episodes
        </Link>
      </p>
    </article>
  );
}
