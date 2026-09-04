import { useEffect, useRef, useState } from "react";
import musicTracks from "../data/musicTracks";

const MusicPlayer = () => {
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const track = musicTracks[currentTrack];

  // ============================================================
  // LOAD CURRENT TRACK
  // ============================================================

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.load();

    audioRef.current.volume = volume;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrack]);

  // ============================================================
  // VOLUME
  // ============================================================

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ============================================================
  // PLAY / PAUSE
  // ============================================================

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log("Audio playback was blocked:", error);
      setIsPlaying(false);
    }
  };

  // ============================================================
  // NEXT TRACK
  // ============================================================

  const nextTrack = () => {
    setCurrentTrack((prev) =>
      prev === musicTracks.length - 1 ? 0 : prev + 1
    );

    setProgress(0);
  };

  // ============================================================
  // PREVIOUS TRACK
  // ============================================================

  const previousTrack = () => {
    setCurrentTrack((prev) =>
      prev === 0 ? musicTracks.length - 1 : prev - 1
    );

    setProgress(0);
  };

  // ============================================================
  // UPDATE PROGRESS
  // ============================================================

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;

    if (duration) {
      setProgress((current / duration) * 100);
    }
  };

  // ============================================================
  // CLICK PROGRESS BAR
  // ============================================================

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const clickPosition = e.clientX - rect.left;

    const percentage = clickPosition / rect.width;

    audioRef.current.currentTime =
      percentage * audioRef.current.duration;
  };

  // ============================================================
  // SONG ENDED
  // ============================================================

  const handleTrackEnded = () => {
    nextTrack();
  };

  return (
    <>
      {/* ========================================================
          AUDIO ELEMENT
      ======================================================== */}

      <audio
        ref={audioRef}
        src={track.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
        preload="auto"
      />

      {/* ========================================================
          MUSIC PLAYER
      ======================================================== */}

      <div
        className="
          fixed
          bottom-6
          left-1/2
          -translate-x-1/2
          z-[9999]
          w-[92vw]
          max-w-[430px]
        "
      >
        <div
          className="
            bg-[#11131f]/95
            backdrop-blur-xl
            border
            border-white/10
            rounded-full
            shadow-[0_0_30px_rgba(229,9,20,0.18)]
            px-3
            py-2
            flex
            items-center
            gap-3
          "
        >

          {/* ==================================================
              COVER
          ================================================== */}

          <img
            src={track.cover}
            alt={track.title}
            className="
              w-12
              h-12
              rounded-full
              object-cover
              border
              border-white/20
              shrink-0
            "
          />

          {/* ==================================================
              TRACK INFORMATION
          ================================================== */}

          <div className="min-w-0 flex-1">

            <div
              className="
                text-[11px]
                font-semibold
                text-white
                truncate
              "
            >
              {track.title}
            </div>

            <div
              className="
                text-[9px]
                text-white/40
                font-mono
                truncate
                mt-0.5
              "
            >
              {track.artist}
            </div>

            {/* PROGRESS BAR */}

            <div
              onClick={handleProgressClick}
              className="
                mt-2
                w-full
                h-[3px]
                bg-white/10
                rounded-full
                cursor-pointer
                overflow-hidden
              "
            >
              <div
                className="
                  h-full
                  bg-red-600
                  rounded-full
                  transition-all
                  duration-100
                "
                style={{
                  width: `${progress}%`
                }}
              />
            </div>

          </div>

          {/* ==================================================
              PREVIOUS
          ================================================== */}

          <button
            onClick={previousTrack}
            aria-label="Previous track"
            className="
              text-white/50
              hover:text-white
              transition-colors
              text-sm
              hidden
              sm:block
            "
          >
            ‹
          </button>

          {/* ==================================================
              PLAY / PAUSE
          ================================================== */}

          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            className="
              w-9
              h-9
              rounded-full
              border
              border-red-600/50
              bg-red-600/10
              text-red-500
              hover:bg-red-600
              hover:text-white
              transition-all
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>

          {/* ==================================================
              NEXT
          ================================================== */}

          <button
            onClick={nextTrack}
            aria-label="Next track"
            className="
              text-white/50
              hover:text-white
              transition-colors
              text-sm
            "
          >
            ›
          </button>

        </div>
      </div>
    </>
  );
};

export default MusicPlayer;