
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

type Story = {
  title: string;
  images: string[];
  highlight: string;
  content: string;
  location: string;
  name: string;
};

interface StoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: Story;
}

const StoryModal: React.FC<StoryModalProps> = ({ open, onOpenChange, story }) => {
  const [photoIndex, setPhotoIndex] = React.useState(0);

  React.useEffect(() => {
    setPhotoIndex(0);
  }, [story, open]);

  if (!story) return null;

  const goLeft = () => setPhotoIndex((idx) => (idx === 0 ? story.images.length - 1 : idx - 1));
  const goRight = () => setPhotoIndex((idx) => (idx === story.images.length - 1 ? 0 : idx + 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{story.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 items-center mt-2">
          <div className="relative w-full md:w-2/3 aspect-[4/3] flex items-center justify-center rounded-lg overflow-hidden bg-muted">
            <button
              aria-label="Previous photo"
              onClick={goLeft}
              className="absolute left-2 z-10 bg-white/60 hover:bg-white/90 rounded-full p-1 shadow"
            >
              <ChevronLeft />
            </button>
            {story.images.length > 0 ? (
              <img
                src={story.images[photoIndex]}
                alt={`${story.title} photo ${photoIndex + 1}`}
                className="h-[220px] md:h-[270px] w-full object-cover transition-all rounded-lg"
              />
            ) : (
              <ImageIcon className="text-gray-300 w-20 h-20" />
            )}
            <button
              aria-label="Next photo"
              onClick={goRight}
              className="absolute right-2 z-10 bg-white/60 hover:bg-white/90 rounded-full p-1 shadow"
            >
              <ChevronRight />
            </button>
            {story.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {story.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block w-2 h-2 rounded-full ${idx === photoIndex ? "bg-forest-700" : "bg-gray-200"}`}
                  ></span>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-forest-700 mb-2">{story.highlight}</div>
            <p className="text-gray-700 mb-3">{story.content}</p>
            <div className="mt-2 text-sm text-forest-900 font-medium">
              — {story.name}, {story.location}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryModal;

