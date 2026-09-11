import React, { useState } from "react";
import {
  Cpu,
  ShieldCheck,
  Zap,
  Database,
  CheckCircle2,
  Layers,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface ModelInfo {
  id: string;
  name: string;
  task: string;
  modality: string;
  architecture: string;
  version: string;
  benchmark: string;
  status: string;
  trainingDataset: string;
  parameters: string;
}

export function ModelsView() {
  const [models] = useState<ModelInfo[]>([
    {
      id: "satquery-vqa-pro",
      name: "SatQuery-VQA-Pro",
      task: "Visual Question Answering & Captioning",
      modality: "Multispectral Optical (Sentinel-2 10m - 60m)",
      architecture: "Vision Transformer (ViT) + LoRA (r=16, a=32)",
      version: "v2.4.1",
      benchmark: "VRSBench (89.2% OA)",
      status: "Online / Active",
      trainingDataset: "BigEarthNet.txt (Sentinel-2 Multispectral)",
      parameters: "324M (8.2M trainable LoRA)",
    },
    {
      id: "satquery-bitemp-diff",
      name: "SatQuery-BiTempDiff-v3.2",
      task: "Bi-Temporal Change Detection & Spatial VQA",
      modality: "Dual-Timestamp Optical (T1, T2)",
      architecture: "Siamese Feature Pyramid + Cross-Attention Difference Transformer",
      version: "v3.2.0",
      benchmark: "VRSBench Change Detection (91.8% F1, 0.892 mIoU)",
      status: "Online / Active",
      trainingDataset: "BigEarthNet.txt + VRSBench Co-registered Pairs",
      parameters: "410M (12.4M trainable)",
    },
    {
      id: "crossmodal-sar-opt",
      name: "CrossModal-SAR-OptFusion-v2",
      task: "Optical + SAR Cross-Modal Fusion",
      modality: "Sentinel-2 MSI + Sentinel-1 C-SAR (VV/VH)",
      architecture: "Dual-Stream Cross-Sensor Attention + Co-Registration Encoder",
      version: "v2.1.0",
      benchmark: "BigEarthNet Multimodal Benchmark (94.6% OA)",
      status: "Online / Active",
      trainingDataset: "BigEarthNet.txt (Co-registered Sentinel-1 SAR & Sentinel-2 MSI)",
      parameters: "480M (14.1M trainable)",
    },
    {
      id: "satquery-grounding-rs",
      name: "SatQuery-Grounding-RS-v4",
      task: "Spatial Grounding & Bounding Box Localization",
      modality: "Multispectral + High-Res Optical",
      architecture: "Grounding-DINO Remote Sensing Backbone + PEFT",
      version: "v4.0.2",
      benchmark: "VRSBench Grounding (78.9% Acc@0.5)",
      status: "Online / Active",
      trainingDataset: "VRSBench + BigEarthNet Annotations",
      parameters: "350M",
    },
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 text-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <Cpu className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Model Registry & Open-Source Benchmark Datasets
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Specialized remote sensing vision-language models, Parameter-Efficient Fine-Tuning (PEFT), and benchmark telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LoRA Inference Engine: Synced</span>
        </div>
      </div>

      {/* Primary Open-Source Datasets & Benchmarks Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 text-slate-900 flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono">
            TRAINING & EVALUATION BENCHMARKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BigEarthNet.txt */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                  Primary Dataset
                </span>
                <a
                  href="https://arxiv.org/abs/2603.29630"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
                >
                  <span>arXiv: 2603.29630</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">BigEarthNet.txt</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Primary dataset for remote-sensing adaptation using co-registered Sentinel-1 SAR,
                Sentinel-2 multispectral imagery, and diverse text annotations. All datasets are
                available online open source.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200/70 text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Co-registered Optical + SAR Multi-modal</span>
            </div>
          </div>

          {/* VRSBench */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Public Evaluation Benchmark
                </span>
                <span className="text-xs text-slate-500 font-mono">Open Access</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">VRSBench</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standardized benchmark for vision-language remote sensing image analysis, spatial
                grounding, visual question answering, and change detection verification.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200/70 text-[11px] font-mono text-purple-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Comprehensive Multi-task Remote Sensing Evaluation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {models.map((m) => (
          <div
            key={m.id}
            className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-md flex flex-col justify-between text-slate-900"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-bold">
                  {m.version}
                </span>
                <span className="text-emerald-600 font-mono text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {m.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-0.5">{m.name}</h3>
              <p className="text-xs text-sky-700 font-mono mb-4">{m.task}</p>

              <div className="space-y-2 text-xs font-mono bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Architecture:</span>
                  <span className="text-slate-800 text-right truncate max-w-[200px]">
                    {m.architecture}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Benchmark:</span>
                  <span className="text-amber-700 font-bold">{m.benchmark}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Modality:</span>
                  <span className="text-slate-800">{m.modality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Weights/Params:</span>
                  <span className="text-slate-800">{m.parameters}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Training: {m.trainingDataset}</span>
              <span className="text-sky-600 font-mono font-bold">Loaded in VRAM</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
