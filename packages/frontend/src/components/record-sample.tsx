import { useRef, useState } from 'react'
import { IoIosMic } from 'react-icons/io'
import { useNavigate } from 'react-router'

import { detectSong } from '../api/my-server'
import { Loading } from './loading'

export const RecordSample = () => {
  const navigate = useNavigate()
  const [isRecording, setIsRecording] = useState(false)

  const mediaStreamRef = useRef<MediaStream>()
  const audioRecorderRef = useRef<MediaRecorder>()

  const [onFindingSong, setOnFindingSong] = useState(false)

  const onRecordDone = async (sample: Blob) => {
    setOnFindingSong(true)

    const res = await detectSong(sample)

    setOnFindingSong(false)

    if (res.data) {
      navigate(`/track/${res.data}`)
    } else {
      alert('Song is not found')
    }
  }

  const toggleRecord = async () => {
    if (mediaStreamRef.current && audioRecorderRef.current) {
      audioRecorderRef.current.stop()
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      setIsRecording(false)

      audioRecorderRef.current = undefined
      mediaStreamRef.current = undefined
      return
    }

    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      audioRecorderRef.current = new MediaRecorder(mediaStreamRef.current)
      audioRecorderRef.current.ondataavailable = (e) => onRecordDone(e.data)
      audioRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div className="flex flex-col  items-center">
      {!onFindingSong ? (
        <>
          <h1 className="text-2xl">Start record for identify the song!</h1>
          <div className="relative">
            <span
              className={`
              animate-ping 
              absolute 
              inline-flex 
              h-full 
              w-full 
              rounded-full 
              bg-primary
              opacity-75
              ${isRecording ? '' : 'hidden'}
          `}
            ></span>
            <button
              className="rounded-full p-3 relative"
              title="record a sample"
              onClick={() => toggleRecord()}
            >
              <IoIosMic size={64}></IoIosMic>
            </button>
          </div>
        </>
      ) : (
        <h1 className="text-2xl">
          <Loading title="Finding song..."></Loading>
        </h1>
      )}
    </div>
  )
}
