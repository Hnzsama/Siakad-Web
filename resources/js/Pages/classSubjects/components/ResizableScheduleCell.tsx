import { ScheduleItem } from "@/types/app/timetable";
import { Resizable } from "react-resizable";

interface ResizableScheduleCellProps {
    cell: ScheduleItem;
    cellKey: string;
    dayIndex: number;
    onResize: (cellKey: string, e: any, data: any) => void;
    onResizeStart: () => void;
    onResizeStop: (cellKey: string, e: any, data: any) => void;
    calculateMaxHeight: (startTime: string, dayIndex: number) => number;
}

export const ResizableScheduleCell: React.FC<ResizableScheduleCellProps> = ({
    cell,
    cellKey,
    dayIndex,
    onResize,
    onResizeStart,
    onResizeStop,
    calculateMaxHeight,
}) => {
    return (
        <Resizable
            height={cell.height}
            width={200}
            onResize={(e, data) => onResize(cellKey, e, data)}
            onResizeStart={onResizeStart}
            onResizeStop={(e, data) => onResizeStop(cellKey, e, data)}
            minConstraints={[200, 72]}
            maxConstraints={[200, calculateMaxHeight(cell.startTime, dayIndex)]}
            handle={<div className="absolute bottom-0 left-0 right-0 z-10 h-2 bg-gray-300 cursor-ns-resize" />}
            resizeHandles={["s"]}
        >
            <div
                className="absolute inset-0 p-3 m-1 border border-blue-100 rounded-md shadow-sm bg-blue-50"
                style={{ height: cell.height - 2 }}
            >
                <div className="font-medium text-blue-800">{cell.subject}</div>
                <div className="text-xs text-blue-600">
                    {cell.startTime} - {cell.endTime}
                </div>
            </div>
        </Resizable>
    );
};
