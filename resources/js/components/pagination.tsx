import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={!canGoPrevious}
            >
                <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canGoPrevious}
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1 min-w-[100px] justify-center">
                <span className="text-sm">
                    {currentPage} / {totalPages}
                </span>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canGoNext}
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={!canGoNext}
            >
                <ChevronsRight className="w-4 h-4" />
            </Button>
        </div>
    );
}
