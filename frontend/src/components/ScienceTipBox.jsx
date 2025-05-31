import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ScienceTipBox.css";

const TIP_INTERVAL = 15000; // 15 seconds

export default function ScienceTipBox() {
  const [tips, setTips] = useState([]); // Store all tips fetched once
  const [tipIndex, setTipIndex] = useState(null); // Current tip index
  const [tip, setTip] = useState("");
  const [source, setSource] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  // Timer state
  const [timerStart, setTimerStart] = useState(Date.now());
  const [timerElapsed, setTimerElapsed] = useState(0); // ms

  const intervalRef = useRef(null);
  const spinnerIntervalRef = useRef(null);

  // Fetch all tips once from /api/plant-tips
  const fetchAllTips = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await axios.get("/api/plant-tips/all"); // Assuming this returns array of tips
      // Example response.data = [{ tip: "...", source: "..." }, {...}, ...]
      if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error("No tips available");
      }
      setTips(response.data);
      // Pick initial random tip
      const initialIndex = Math.floor(Math.random() * response.data.length);
      setTip(response.data[initialIndex].tip);
      setSource(response.data[initialIndex].source || "");
      setTipIndex(initialIndex);
      setAnimationKey(Date.now());
    } catch (err) {
      setError(true);
      setTip("Syncing with plant science network...");
      setSource("Connection retrying");
    }
    setIsLoading(false);
  };

  // Pick a new tip index different from current
  const pickNewTipIndex = () => {
    if (tips.length <= 1) return tipIndex; // No alternative tip
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * tips.length);
    } while (newIndex === tipIndex);
    return newIndex;
  };

  // Show next tip locally (random, no repeats)
  const showNextTip = () => {
    if (tips.length === 0) return;
    const newIndex = pickNewTipIndex();
    setTip(tips[newIndex].tip);
    setSource(tips[newIndex].source || "");
    setTipIndex(newIndex);
    setAnimationKey(Date.now());
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!collapsed) {
      const remaining = TIP_INTERVAL - timerElapsed;
      intervalRef.current = setTimeout(() => {
        showNextTip();
        setTimerStart(Date.now());
        setTimerElapsed(0);
      }, remaining);

      spinnerIntervalRef.current = setInterval(() => {
        setTimerElapsed(Date.now() - timerStart);
      }, 50);
    } else {
      clearTimeout(intervalRef.current);
      clearInterval(spinnerIntervalRef.current);
      setTimerElapsed(Date.now() - timerStart);
    }

    return () => {
      clearTimeout(intervalRef.current);
      clearInterval(spinnerIntervalRef.current);
    };
  }, [collapsed, timerStart, timerElapsed, tips, tipIndex]);
  // ^^^ Warning suppressed above

  // On mount: fetch all tips once
  useEffect(() => {
    fetchAllTips().then(() => {
      setTimerStart(Date.now());
      setTimerElapsed(0);
    });
  }, []);

  // Toggle collapse/expand
  const handleToggle = () => {
    setCollapsed((prev) => !prev);
    if (collapsed) {
      setTimerStart(Date.now() - timerElapsed);
    }
  };

  // Spinner progress (0 to 1)
  const spinnerProgress = collapsed
    ? timerElapsed / TIP_INTERVAL
    : Math.min(timerElapsed / TIP_INTERVAL, 1);

  // Spinner stroke offset (for progress ring effect)
  const circleLength = 113; // 2 * Math.PI * r (r=18)
  const spinnerOffset = circleLength * (1 - spinnerProgress);

  return (
    <motion.div
      className={`science-tip-box${collapsed ? " collapsed" : ""}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        width: collapsed ? 48 : 240,
        maxHeight: collapsed ? 48 : 220,
      }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {collapsed ? (
        <div
          className="spinner-wrapper lock-wrapper"
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          aria-label="Expand science tips"
        >
          <svg className="spinner-circle" viewBox="0 0 40 40">
            <circle
              className="spinner-path"
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="#2e7d32"
              strokeWidth="3"
              style={{
                strokeDasharray: circleLength,
                strokeDashoffset: spinnerOffset,
                transition: collapsed ? "none" : "stroke-dashoffset 0.1s linear",
              }}
            />
          </svg>
          <span className="lock-icon">🔒</span>
        </div>
      ) : (
        <>
          <div className="tip-header">
            <h3 className="tip-title">
              <span className="tip-title-text">🔬 Scientific Tips</span>
            </h3>
            <div
              className="spinner-wrapper"
              onClick={handleToggle}
              role="button"
              tabIndex={0}
              aria-label="Collapse science tips"
            >
              <svg className="spinner-circle" viewBox="0 0 40 40">
                <circle
                  className="spinner-path"
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="#2e7d32"
                  strokeWidth="3"
                  style={{
                    strokeDasharray: circleLength,
                    strokeDashoffset: spinnerOffset,
                    transition: collapsed
                      ? "none"
                      : "stroke-dashoffset 0.1s linear",
                  }}
                />
              </svg>
              <span className="collapse-icon">❌</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={animationKey}
              className="tip-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              layout
            >
              <div
                className={`tip-content ${
                  isLoading ? "loading" : error ? "error" : ""
                }`}
              >
                <ReactMarkdown>{tip}</ReactMarkdown>
              </div>
              <p className="tip-source">{source}</p>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}
