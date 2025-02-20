import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Camera, RotateCw, Flashlight, FlashlightOff } from 'lucide-react';
import { useResourceContext } from '../context/context';
import { Attendance, FormData } from '../data/schema';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatHI } from '@/helpers/FormatHI';
import KalmanFilter from 'kalmanjs'; // Perlu diinstall: npm install kalmanjs

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRow?: Attendance;
}

export function MutateDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow;
    const { user } = usePage().props.auth;
    const { resourceName, mainRoute } = useResourceContext();
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const role = user.roles?.[0].name;
    const isAdmin = role === 'admin';

    console.log(user.teacher?.id)

    const attendableId = user.student?.id || user.teacher?.id || "";
    console.log(`attendableId : ${user.teacher?.id}`)
    const attendableType = user.student ? "App\\Models\\Student" :
                          user.teacher ? "App\\Models\\Teacher" :
                          "App\\Models\\Student";

    const { data, setData, post, put, errors, processing, reset } = useForm<FormData>({
        attendable_id: currentRow?.attendable_id ?? attendableId,
        attendable_type: currentRow?.attendable_type ?? attendableType,
        date: currentRow?.date ?? new Date().toISOString().split('T')[0],
        check_in: currentRow?.check_in ?? formatHI(""),
        check_out: currentRow?.check_out ?? formatHI(""),
        status: currentRow?.status ?? "Present",
        location_latitude: currentRow?.location_latitude ?? null,
        location_longitude: currentRow?.location_longitude ?? null,
        device_info: currentRow?.device_info ?? navigator.userAgent,
        photo_path: null,
        notes: currentRow?.notes ?? null,
    });

    const [watchId, setWatchId] = useState<number | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [positions, setPositions] = useState<GeolocationPosition[]>([]);
    const kalmanLat = new KalmanFilter({R: 0.01, Q: 3});
    const kalmanLng = new KalmanFilter({R: 0.01, Q: 3});

    const [locationStatus, setLocationStatus] = useState<string>('Waiting for location...');
    const [currentAccuracy, setCurrentAccuracy] = useState<number>(0);

    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 5;
    const ACCURACY_THRESHOLD = 50; // meters

    const getAccurateLocation = async () => {
        if ("geolocation" in navigator) {
            try {
                setLocationStatus('Getting location...');
                if (watchId) {
                    navigator.geolocation.clearWatch(watchId);
                }

                const options = {
                    enableHighAccuracy: true,
                    timeout: 30000,
                    maximumAge: 0,
                };

                // Fungsi untuk mendapatkan posisi dengan promise
                const getCurrentPositionPromise = () => new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, options);
                });

                // Fungsi retry dengan delay
                const getPositionWithRetry = async () => {
                    try {
                        const position = await getCurrentPositionPromise();

                        // Jika akurasi masih buruk dan masih ada kesempatan retry
                        if (position.coords.accuracy > ACCURACY_THRESHOLD && retryCount < MAX_RETRIES) {
                            setRetryCount(prev => prev + 1);
                            setLocationStatus(`Accuracy too low (${position.coords.accuracy.toFixed(0)}m), retrying... (${retryCount + 1}/${MAX_RETRIES})`);

                            // Tunggu 2 detik sebelum mencoba lagi
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            return getPositionWithRetry();
                        }

                        return position;
                    } catch (error) {
                        if (retryCount < MAX_RETRIES) {
                            setRetryCount(prev => prev + 1);
                            setLocationStatus(`Failed to get location, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            return getPositionWithRetry();
                        }
                        throw error;
                    }
                };

                const position = await getPositionWithRetry();

                // Set position data
                setData(data => ({
                    ...data,
                    location_latitude: String(position.coords.latitude),
                    location_longitude: String(position.coords.longitude),
                }));
                setCurrentAccuracy(position.coords.accuracy);

                // Update status dengan info lebih detail
                setLocationStatus(`Location acquired:
                    Accuracy: ${position.coords.accuracy.toFixed(1)}m
                    Lat: ${position.coords.latitude.toFixed(6)}
                    Long: ${position.coords.longitude.toFixed(6)}`);

                // Mulai watching hanya jika akurasi masih di atas threshold
                if (position.coords.accuracy > ACCURACY_THRESHOLD) {
                    const id = navigator.geolocation.watchPosition(
                        (newPosition) => {
                            console.log('New position:', newPosition.coords);
                            if (newPosition.coords.accuracy < position.coords.accuracy) {
                                setData(data => ({
                                    ...data,
                                    location_latitude: String(newPosition.coords.latitude),
                                    location_longitude: String(newPosition.coords.longitude),
                                }));
                                setCurrentAccuracy(newPosition.coords.accuracy);
                                setLocationStatus(`Location improved:
                                    Accuracy: ${newPosition.coords.accuracy.toFixed(1)}m
                                    Lat: ${newPosition.coords.latitude.toFixed(6)}
                                    Long: ${newPosition.coords.longitude.toFixed(6)}`);

                                if (newPosition.coords.accuracy <= ACCURACY_THRESHOLD) {
                                    navigator.geolocation.clearWatch(id);
                                }
                            }
                        },
                        (error) => {
                            console.error('Watch position error:', error);
                            setLocationStatus(`Error: ${error.message}`);
                        },
                        options
                    );
                    setWatchId(id);
                }

            } catch (error) {
                console.error('Final error getting location:', error);
                setLocationStatus('Failed to get accurate location after all retries');
                toast({
                    variant: "destructive",
                    title: "Location Error",
                    description: "Could not get accurate location. Please ensure you're outdoors with clear sky view."
                });
            }
        }
    };

    useEffect(() => {
        if (open && !isAdmin && !stream) {
            startCamera();
            getAccurateLocation();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(null);
            }
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
                setWatchId(null);
            }
            setPositions([]); // Clear positions on cleanup
        };
    }, [open]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            toast({
                variant: "destructive",
                title: "Error accessing camera",
                description: "Please make sure you have given camera permissions"
            });
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
                setData('photo_path', file);
                setPhotoPreview(URL.createObjectURL(blob));
            }
        }, 'image/jpeg');
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAdmin && !data.photo_path) {
            toast({
                variant: "destructive",
                title: "Photo required",
                description: "Please capture a photo for attendance"
            });
            return;
        }

        console.log(data)

        setIsLoading(true);

        const options = {
            onError: (errors: any) => {
                console.error('Error:', errors);
                reset();
                setIsLoading(false);
                toast({
                    variant: "destructive",
                    title: `Failed to save ${resourceName}`,
                    description: "Please check your form"
                });
            },
            onSuccess: (response: any) => {
                console.log('Success:', response);
                onOpenChange(false);
                reset();
                setPhotoPreview(null);
                setIsLoading(false);
                toast({
                    title: isUpdate ? `${resourceName} updated successfully` : `${resourceName} saved successfully`,
                    description: isUpdate
                        ? `${resourceName} has been updated in the system`
                        : `${resourceName} has been added to the system`
                });
            },
            preserveScroll: true
        };

        if (isUpdate && currentRow?.id) {
            put(route(`${mainRoute}.update`, { id: currentRow.id }), options);
        } else {
            post(route(`${mainRoute}.store`), options);
        }
    };

    const renderSubmitButton = () => {
        if (isLoading) return "Saving...";
        if (currentAccuracy > ACCURACY_THRESHOLD) {
            return `Waiting for better accuracy (${currentAccuracy.toFixed(0)}m)`;
        }
        return "Submit Attendance";
    };

    if (!isAdmin) {
        return (
            <Dialog open={open} onOpenChange={(v) => {
                onOpenChange(v);
                if (!v) {
                    setPhotoPreview(null);
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                        setStream(null);
                    }
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={onSubmit}>
                        <DialogHeader>
                            <DialogTitle>Record Attendance</DialogTitle>
                            <DialogDescription>
                                Please take a photo to record your attendance
                            </DialogDescription>
                        </DialogHeader>

                        {/* Add location status display */}
                        <div className="px-4 py-2 mb-4 text-sm bg-muted rounded-md whitespace-pre-line">
                            {locationStatus}
                        </div>

                        <div className="flex flex-col items-center py-4 space-y-4">
                            {!photoPreview ? (
                                <div className="relative w-full overflow-hidden rounded-lg h-96 bg-muted">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1">
                                        {Array.from({ length: 9 }).map((_, index) => (
                                            <div key={index} className="border border-white opacity-25" />
                                        ))}
                                    </div>
                                    <div className="absolute flex space-x-2 bottom-4 right-4">
                                        <Button
                                            type="button"
                                            onClick={capturePhoto}
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full overflow-hidden rounded-lg h-96 bg-muted">
                                    <img
                                        src={photoPreview}
                                        alt="Attendance photo"
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 border-4 border-white opacity-25" />
                                </div>
                            )}
                            <Button
                                type="button"
                                onClick={photoPreview ? () => {
                                    setPhotoPreview(null);
                                    startCamera();
                                } : capturePhoto}
                                className="w-full"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                {photoPreview ? 'Retake Photo' : 'Take Photo'}
                            </Button>
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={processing || isLoading || currentAccuracy > ACCURACY_THRESHOLD}
                            >
                                {renderSubmitButton()}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    // Admin view remains the same
    return (
        <Sheet open={open} onOpenChange={(v) => {
            onOpenChange(v);
            if (!v) {
                reset();
                setPhotoPreview(null);
            }
        }}>
            <SheetContent className="w-full sm:max-w-xl">
                <form id="attendance-form" onSubmit={onSubmit} className="flex flex-col h-full">
                    <SheetHeader className="space-y-2 text-left">
                        <SheetTitle>{isUpdate ? 'Update' : 'Record'} Attendance</SheetTitle>
                        <SheetDescription>
                            {isUpdate
                                ? `Update attendance record with required information.`
                                : `Record new attendance with required information.`}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-col mt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={data.notes || ''}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Enter any additional notes"
                            />
                        </div>
                    </div>

                    <SheetFooter className="flex-shrink-0 gap-2 mt-6">
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                        <Button type="submit" disabled={processing || isLoading}>
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
