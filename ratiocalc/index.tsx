import React, { useState, useEffect } from 'react';

/**
 * 年利率を計算するコンポーネント
 */
const InterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(1000000); // 初期投資額
  const [intervalMonths, setIntervalMonths] = useState<number>(1); // 入金間隔 (月)
  const [depositAmount, setDepositAmount] = useState<number>(50000); // 1回の入金額
  const [years, setYears] = useState<number>(10); // 期間 (年)
  const [finalValue, setFinalValue] = useState<number>(10000000); // 最終評価額
  const [annualRate, setAnnualRate] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    calculateRate();
  }, [principal, intervalMonths, depositAmount, years, finalValue]);

  /**
   * ニュートン法を用いて年利率を算出
   * 評価関数 f(r) = (将来価値の計算式) - 目標評価額
   */
  const calculateRate = () => {
    const n = (years * 12) / intervalMonths; // 合計入金回数
    const t = intervalMonths / 12; // 1回あたりの期間(年単位)
    const target = finalValue;

    // 初期推定値 (年利 5%)
    let r = 0.05;
    let iterations = 0;
    const maxIterations = 100;
    const epsilon = 0.0001;

    try {
      while (iterations < maxIterations) {
        const factor = Math.pow(1 + r * t, n);
        // 複利計算式: PV * (1+rt)^n + PMT * [((1+rt)^n - 1) / (rt)]
        // 注意: 簡略化のため、各期間の利率を r*t と近似
        const f = principal * factor + (depositAmount * (factor - 1)) / (r * t || 0.000001) - target;
        
        // 微分係数 f'(r)
        const df = principal * n * t * Math.pow(1 + r * t, n - 1) +
                   depositAmount * ((n * t * Math.pow(1 + r * t, n - 1) * (r * t) - (factor - 1) * t) / Math.pow(r * t, 2));

        const nextR = r - f / df;

        if (Math.abs(nextR - r) < epsilon) {
          setAnnualRate(nextR * 100);
          setError("");
          return;
        }
        r = nextR;
        iterations++;
      }
      setAnnualRate(null);
      setError("収束しませんでした。入力値を確認してください。");
    } catch (e) {
      setError("計算エラーが発生しました。");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">複利・積立利率計算機</h1>
      
      <div className="grid grid-cols-1 gap-4 text-sm">
        <div>
          <label className="block font-medium">最初にあった額 (円)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full border p-2 rounded" />
        </div>
        
        <div>
          <label className="block font-medium">入金の間隔 (ヶ月単位 / 1年なら12)</label>
          <input type="number" value={intervalMonths} onChange={(e) => setIntervalMonths(Number(e.target.value))} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block font-medium">一回の入金額 (円)</label>
          <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(Number(e.target.value))} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block font-medium">期間 (年)</label>
          <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block font-medium">最終的な評価額 (円)</label>
          <input type="number" value={finalValue} onChange={(e) => setFinalValue(Number(e.target.value))} className="w-full border p-2 rounded" />
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
        <h2 className="text-lg font-semibold text-blue-900">計算された推定年利率</h2>
        {error ? (
          <p className="text-red-500 mt-2">{error}</p>
        ) : (
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {annualRate !== null ? annualRate.toFixed(3) : "--"} <span className="text-xl">%</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default InterestCalculator;