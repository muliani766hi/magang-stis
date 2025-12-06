'use client';

import { useEffect, useState } from 'react';
import Map from './Map';
import { Loader } from '@mantine/core';
import { PresensiProps } from './page';
import { notifications } from '@mantine/notifications';

const Location = ({ targetLocation, fetchData, records, loading }: { targetLocation: PresensiProps, fetchData: () => void, records: any, loading: boolean }) => {
    const [userLocation, setUserLocation] = useState<{ latitude: number | null, longitude: number | null }>({
        latitude: null,
        longitude: null
    }); // Change initial state to null

    useEffect(() => {
        const getUserLocation = async () => {
            try {
                const position: GeolocationPosition = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => resolve(position),
                        (error) => reject(error)
                    );
                });
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
            } catch (error: any) {
                console.error('Error getting location:', error.message);
                notifications.show(
                    {
                        title: 'Error',
                        message: error.message,
                        color: 'red'
                    }
                )
            }
        };

        getUserLocation();
    }, []);

    return (
        <div>
            {userLocation ? (
                <>
                    <Map currentLocation={
                        {
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude
                        }
                    }
                        targetLocation={targetLocation}
                        fetchData={fetchData}
                        records={records}
                        loading={loading}
                    />
                </>
            ) : (
                <Loader size="xl" />
            )}

        </div>
    );
};

export default Location;
