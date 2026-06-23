import { useMemo } from 'react';
import { cn } from '../utils/cn';
import { SEAT_STATUS, ZONE_CONFIG, ZONES } from '../utils/constants';
import { calculateSeatNumber } from '../utils/ticketUtils';

const SEAT_COUNT_PER_ROW = 9;

// Các hàng tương ứng với index trong config
const ZONE_A_GROUPS = [["A", "B"]]; // 1 nhóm, căn giữa
const ZONE_B_GROUPS = [["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]; // 4 nhóm, chia 2 cột

// Sửa SeatButton: hiển thị số thay vì seatNumber
const SeatButton = ({ seat, zone, onSelect, isSelected, disabled }) => {
  const { row, col, status } = seat;
  const seatNumber = calculateSeatNumber(zone, row, col);

  const getSeatColor = () => {
    if (isSelected) return 'bg-primary-600 text-white border-primary-600 cursor-pointer';
    switch (status) {
      case SEAT_STATUS.AVAILABLE:
        return 'bg-white border-2 border-gray-300 hover:border-primary-500 hover:bg-primary-50 text-gray-800 cursor-pointer';
      case SEAT_STATUS.SOLD:
        return 'bg-gray-300 text-gray-500 border-2 border-gray-300 cursor-not-allowed opacity-60';
      case SEAT_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 cursor-not-allowed animate-pulse';
      default:
        return 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed';
    }
  };

  const isDisabled = disabled || status === SEAT_STATUS.SOLD || status === SEAT_STATUS.PENDING;

  return (
    <button
      className={cn(
        'w-10 h-10 text-xs font-semibold border-2 rounded transition-all duration-200',
        getSeatColor(),
        isDisabled && 'cursor-not-allowed opacity-60'
      )}
      onClick={() => !isDisabled && onSelect({ zone, row, col, seatNumber })}
      disabled={isDisabled}
      title={`Seat ${seatNumber} - ${status}`}
    >
      {col + 1}  {/* ← chỉ hiển thị số */}
    </button>
  );
};

// Sửa renderRow: thêm label chữ cái bên trái
const renderRow = ({ rowIndex, rowLabel, zone, seats, selectedSeats, onSeatSelect, disabled }) => {
  const isSeatSelected = (col) =>
    selectedSeats.some(s => s.zone === zone && s.row === rowIndex && s.col === col);

  return (
    <div key={rowLabel} className="mt-2 flex gap-2 items-center">
      {/* Label chữ cái bên ngoài, giống tầng 2 */}
      <span className="w-8 text-xs text-gray-400 font-medium text-right pr-2 shrink-0">
        {rowLabel}
      </span>
      {Array.from({ length: SEAT_COUNT_PER_ROW }, (_, col) => {
        const seat = seats.find(s => s.row === rowIndex && s.col === col) || {
          row: rowIndex,
          col,
          status: SEAT_STATUS.AVAILABLE,
        };
        return (
          <SeatButton
            key={`${rowIndex}-${col}`}
            seat={seat}
            zone={zone}
            onSelect={onSeatSelect}
            isSelected={isSeatSelected(col)}
            disabled={disabled}
          />
        );
      })}
    </div>
  );
};

// Zone A: 2 hàng A, B — căn giữa
const ZoneALayout = ({ zone, seats, onSeatSelect, selectedSeats, disabled }) => {
  // A = row 0, B = row 1 (theo alphabet, A=0, B=1...)
  const rowMap = { A: 0, B: 1 };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Zone A</h3>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center gap-0">
          {ZONE_A_GROUPS[0].map((rowLabel) =>
            renderRow({
              rowIndex: rowMap[rowLabel],
              rowLabel,
              zone,
              seats,
              selectedSeats,
              onSeatSelect,
              disabled,
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Zone B: 4 cặp hàng, chia 2 cột trái/phải (C/D | E/F rồi G/H | I/J)
const ZoneBLayout = ({ zone, seats, onSeatSelect, selectedSeats, disabled }) => {
  // C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9
  const rowMap = { C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9 };

  // Chia thành các cặp cột: [[C/D, E/F], [G/H, I/J]]
  const columnPairs = [
    [ZONE_B_GROUPS[0], ZONE_B_GROUPS[1]], // [C/D] | [E/F]
    [ZONE_B_GROUPS[2], ZONE_B_GROUPS[3]], // [G/H] | [I/J]
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Zone B</h3>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm overflow-auto">
        <div className="flex flex-col gap-8">
          {columnPairs.map((pair, pairIdx) => (
            <div key={pairIdx} className="grid grid-cols-2 gap-11">
              {pair.map((group, groupIdx) => (
                <div key={groupIdx}>
                  {group.map((rowLabel) =>
                    renderRow({
                      rowIndex: rowMap[rowLabel],
                      rowLabel,
                      zone,
                      seats,
                      selectedSeats,
                      onSeatSelect,
                      disabled,
                    })
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Level 2 giữ nguyên layout gốc
const ZoneSeating = ({ zoneName, zone, seats, onSeatSelect, selectedSeats, disabled }) => {
  const config = ZONE_CONFIG[zone];

  const isSeatSelected = (row, col) =>
    selectedSeats.some(s => s.zone === zone && s.row === row && s.col === col);

  const grid = useMemo(() => {
    const rows = [];
    for (let row = 0; row < config.rows; row++) {
      const cols = [];
      for (let col = 0; col < config.cols; col++) {
        const seat = seats.find(s => s.row === row && s.col === col) || {
          row,
          col,
          status: SEAT_STATUS.AVAILABLE,
        };
        cols.push(
          <SeatButton
            key={`${row}-${col}`}
            seat={seat}
            zone={zone}
            onSelect={onSeatSelect}
            isSelected={isSeatSelected(row, col)}
            disabled={disabled}
          />
        );
      }
      rows.push(
        <div key={row} className="flex gap-1 items-center">
          <span className="w-8 text-xs text-gray-400 font-medium text-right pr-2">
            {String.fromCharCode(65 + row)}
          </span>
          {cols}
        </div>
      );
    }
    return rows;
  }, [seats, selectedSeats, config, zone, disabled]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">{zoneName}</h3>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm overflow-auto">
        <div className="space-y-1 min-w-max">{grid}</div>
      </div>
    </div>
  );
};

export const SeatingChart = ({ seatData, onSeatSelect, selectedSeats = [], disabled = false }) => {
  if (!seatData) {
    return (
      <div className="text-center py-12 text-gray-500">
        No seating data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
          <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded" />
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
          <div className="w-5 h-5 bg-primary-600 border-2 border-primary-600 rounded" />
          <span className="text-sm text-gray-700">Selected</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
          <div className="w-5 h-5 bg-gray-300 border-2 border-gray-300 rounded" />
          <span className="text-sm text-gray-700">Sold</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
          <div className="w-5 h-5 bg-yellow-100 border-2 border-yellow-300 rounded animate-pulse" />
          <span className="text-sm text-gray-700">Pending</span>
        </div>
      </div>

      {/* Stage */}
      <div className="bg-gray-200 text-gray-700 py-2 text-center rounded-md border border-gray-300 font-semibold shadow-sm tracking-wider">
        STAGE
      </div>

      {/* Zone A — hàng A, B căn giữa */}
      <ZoneALayout
        zone={ZONES.ZONE_A}
        seats={seatData.zone_a || []}
        onSeatSelect={onSeatSelect}
        selectedSeats={selectedSeats}
        disabled={disabled}
      />

      {/* Zone B — C/D | E/F rồi G/H | I/J dạng 2 cột */}
      <div className="border-t border-gray-200 pt-6">
        <ZoneBLayout
          zone={ZONES.ZONE_B}
          seats={seatData.zone_b || []}
          onSeatSelect={onSeatSelect}
          selectedSeats={selectedSeats}
          disabled={disabled}
        />
      </div>

      {/* 2nd Floor — giữ nguyên */}
      <div className="border-t border-gray-200 pt-6">
        <ZoneSeating
          zoneName="2nd Floor"
          zone={ZONES.LEVEL_2}
          seats={seatData.level_2 || []}
          onSeatSelect={onSeatSelect}
          selectedSeats={selectedSeats}
          disabled={disabled}
        />
      </div>
    </div>
  );
};