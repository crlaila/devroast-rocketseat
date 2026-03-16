"use client";

import { useState } from "react";
import { Button, CodeEditor, Toggle } from "@/components";

export function HomeEditor() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const hasCode = code.trim().length > 0;

  return (
    <>
      <CodeEditor
        value={code}
        onChange={setCode}
        className="w-full max-w-[780px] mx-auto h-[480px]"
      />

      <div className="flex items-center justify-between w-full max-w-[780px] mx-auto">
        <div className="flex items-center gap-4">
          <Toggle
            checked={roastMode}
            onChange={setRoastMode}
            label="roast mode"
          />
          <span className="font-['IBM_Plex_Mono',monospace] text-[12px] font-normal text-[#4B5563]">
            {"// maximum sarcasm enabled"}
          </span>
        </div>
        <Button variant="primary" disabled={!hasCode}>
          $ roast_my_code
        </Button>
      </div>
    </>
  );
}
