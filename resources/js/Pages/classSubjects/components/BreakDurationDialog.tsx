import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface BreakDurationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (duration: number) => void;
}

export const BreakDurationDialog: React.FC<BreakDurationDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    const [duration, setDuration] = useState<number>(30);

    const handleConfirm = () => {
        onConfirm(duration);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Atur Durasi Istirahat</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                            Durasi
                        </Label>
                        <Input
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="col-span-3"
                            min={5}
                            max={120}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground col-span-4">
                        Masukkan durasi istirahat (5-120 menit)
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button onClick={handleConfirm}>
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
