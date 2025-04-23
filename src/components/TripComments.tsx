
import React, { useEffect, useState } from 'react';

interface TripCommentsProps {
  tripId: string;
}

type Comment = {
  name: string;
  comment: string;
  date: string;
};

const LOCAL_STORAGE_KEY = 'trip_comments_v1';

function getStoredComments(): Record<string, Comment[]> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredComments(comments: Record<string, Comment[]>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comments));
  } catch {}
}

const TripComments: React.FC<TripCommentsProps> = ({ tripId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  // Load comments on mount
  useEffect(() => {
    const all = getStoredComments();
    setComments(all[tripId] || []);
  }, [tripId]);

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    const newComment: Comment = {
      name: name.trim(),
      comment: comment.trim(),
      date: new Date().toISOString(),
    };
    const updated = [newComment, ...comments];
    setComments(updated);

    // Update localStorage
    const all = getStoredComments();
    all[tripId] = updated;
    setStoredComments(all);

    setName('');
    setComment('');
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="text-base font-semibold mb-2 flex gap-2 items-center">
        <span className="text-forest-800">Comments</span>
      </h4>
      <form className="flex flex-col gap-3 mb-3" onSubmit={handleAddComment}>
        <div className="flex gap-2">
          <input
            className="border rounded px-2 py-1 w-1/3 text-sm"
            type="text"
            placeholder="Your name"
            maxLength={24}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 flex-1 text-sm"
            type="text"
            placeholder="Share your experience..."
            maxLength={160}
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-forest-700 text-white font-medium px-3 py-1 rounded hover:bg-forest-900 transition-colors text-sm"
          >
            Post
          </button>
        </div>
      </form>
      <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
        {comments.length === 0 ? (
          <span className="text-xs text-gray-500">No comments yet. Be the first!</span>
        ) : (
          comments.map((c, i) => (
            <div className="text-sm bg-gray-50 border rounded p-2" key={i}>
              <div className="font-semibold text-forest-900">{c.name} <span className="font-normal text-xs text-gray-400">({new Date(c.date).toLocaleDateString()})</span></div>
              <div className="text-gray-700 break-words">{c.comment}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TripComments;
