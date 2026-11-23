import {
  PaintBrush,
  CoatHanger,
  Dress,
  Camera,
  Disc,
  Flower,
  HandPalm,
  Microphone,
  MicrophoneStage,
  MusicNotes,
  Needle,
  PaintBrushHousehold,
  Palette,
  PersonSimpleTaiChi,
  Stack,
  type Icon,
  type IconProps,
} from "@phosphor-icons/react";
import type { CategorySlug } from "@/types/marketplace";

const icons: Record<CategorySlug, Icon> = {
  "music-and-bands": MusicNotes,
  "singers-and-vocalists": Microphone,
  "djs-and-instrumentalists": Disc,
  "dance-and-choreography": PersonSimpleTaiChi,
  "photography-and-videography": Camera,
  "mehendi-artists": HandPalm,
  "makeup-and-beauty": PaintBrush,
  "saree-draping-and-styling": Dress,
  "painters-and-illustrators": Palette,
  "wall-art-and-murals": PaintBrushHousehold,
  "models-and-fashion-talent": CoatHanger,
  "tattoo-artists": Needle,
  "decorators-and-florists": Flower,
  "emcees-and-event-hosts": MicrophoneStage,
  "other-creative-professionals": Stack,
};

export function CategoryIcon({ slug, ...props }: { slug: CategorySlug } & IconProps) {
  const IconCmp = icons[slug] ?? Stack;
  return <IconCmp aria-hidden {...props} />;
}
