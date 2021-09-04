import React, { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { useSpring, animated } from 'react-spring'
import './App.sass'
import './App.css'

function App() {
  const [hateLoong, setHateLoong] = useState<number>()
  const [hateOldLoong, setHateOldLoong] = useState<number>(0)
  const [loveLoong, setLoveLoong] = useState<number>()
  const [loveOldLoong, setLoveOldLoong] = useState<number>(0)
  const [votePercent, setVotePercent] = useState<number>(50)
  const hateProps = useSpring({
    val: hateLoong,
    from: { val: hateOldLoong },
    config: { duration: 10000 },
  })
  const loveProps = useSpring({
    val: loveLoong,
    from: { val: loveOldLoong },
    config: { duration: 10000 },
  })

  interface HateLoongProvince {
    province: string
    vote: number
  }

  interface LoveLoongProvince {
    id: number
    name: string
    idEnd: string
    count: number
  }

  useEffect(() => {
    let hateVote: number = 0
    axios
      .get('https://api.voteptp.insidethesandbox.studio/responses')
      .then((response: AxiosResponse<HateLoongProvince[]>) => {
        response.data.forEach((province: HateLoongProvince) => {
          hateVote += province.vote
        })
        setHateOldLoong(hateVote)
        setHateLoong(hateVote)
      })
    let loveVote: number = 0
    axios
      .get('https://rakloongtoo.com/api/v1/getScoreProvince')
      .then((response: AxiosResponse<LoveLoongProvince[]>) => {
        response.data.forEach((province: LoveLoongProvince) => {
          loveVote += province.count
        })
        setLoveOldLoong(loveVote)
        setLoveLoong(loveVote)
      })
  }, [])

  useEffect(() => {
    const hateInterval = setInterval(() => {
      setHateOldLoong(hateLoong || 0)
      let hateVote: number = 0
      axios
        .get('https://api.voteptp.insidethesandbox.studio/responses')
        .then((response: AxiosResponse<HateLoongProvince[]>) => {
          response.data.forEach((province: HateLoongProvince) => {
            hateVote += province.vote
          })
          if (hateVote > 0 && hateVote > (hateLoong || 0)) {
            setHateLoong(hateVote)
          }
        })
    }, 10000)
    return () => {
      clearInterval(hateInterval)
    }
  }, [hateLoong])

  useEffect(() => {
    const loveInterval = setInterval(() => {
      setLoveOldLoong(loveLoong || 0)
      let loveVote: number = 0
      axios
        .get('https://rakloongtoo.com/api/v1/getScoreProvince')
        .then((response: AxiosResponse<LoveLoongProvince[]>) => {
          response.data.forEach((province: LoveLoongProvince) => {
            loveVote += province.count
          })
          if (loveVote > 0 && loveVote > (loveLoong || 0)) {
            setLoveLoong(loveVote)
          }
        })
    }, 10000)
    return () => {
      clearInterval(loveInterval)
    }
  }, [loveLoong])

  useEffect(() => {
    if (loveLoong && hateLoong) {
      const percent = Math.floor((loveLoong / (loveLoong + hateLoong)) * 100)
      setVotePercent(percent)
    }
  }, [loveLoong, hateLoong])

  return (
    <div className="fullwidth background">
      <div
        className="fullwidth is-flex is-flex-direction-column is-justify-content-center p-5"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 42, 154, 0.3), ${votePercent}%, rgba(255, 0, 0, 0.3))`,
        }}
      >
        <header className="title is-0 has-text-weight-bold has-text-centered pb-6 is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-center">
          <span style={{ color: '#002a9a', textShadow: '0 0 8px white' }}>
            Love Loong
          </span>
          <span className="px-5" style={{ textShadow: '0 0 8px white' }}>
            vs
          </span>
          <span style={{ color: '#ff0000', textShadow: '0 0 8px white' }}>
            Hate Loong
          </span>
        </header>
        <div className="is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-center">
          <div
            className="card is-flex-grow-1 m-3"
            style={{ backgroundColor: '#002a9a' }}
          >
            <div className="card-content has-text-centered my-5">
              <p className="title is-size-5 is-size-1-desktop has-text-weight-medium has-text-white">
                จำนวนโหวตที่อยากให้ลุงอยู่ต่อ
              </p>
              <span className="title is-size-5 is-size-1-desktop has-text-weight-medium has-text-white">
                {loveLoong ? (
                  <animated.div className="has-text-weight-bold">
                    {loveProps.val.to(
                      (val) => Math.floor(val).toLocaleString('en-US') + ' คน'
                    )}
                  </animated.div>
                ) : (
                  'ไม่สามารถเชื่อมต่อกับเวปไซต์ปลายทางได้'
                )}
              </span>
              <p className="pt-6">
                <a
                  href="https://rakloongtoo.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="is-size-6 is-size-4-desktop has-text-white has-text-weight-medium"
                >
                  ปิดโหวตแล้ว (แหล่งที่มาข้อมูล https://rakloongtoo.com/)
                </a>
              </p>
            </div>
          </div>
          <div
            className="card is-flex-grow-1 m-3"
            style={{ backgroundColor: '#ff0000' }}
          >
            <div className="card-content has-text-centered my-5">
              <p className="title is-size-5 is-size-1-desktop has-text-weight-medium has-text-white">
                จำนวนโหวตที่อยากให้ลุงลาออก
              </p>
              <span className="title is-size-5 is-size-1-desktop has-text-weight-medium has-text-white">
                {hateLoong ? (
                  <animated.div className="has-text-weight-bold">
                    {hateProps.val.to(
                      (val) => Math.floor(val).toLocaleString('en-US') + ' คน'
                    )}
                  </animated.div>
                ) : (
                  'ไม่สามารถเชื่อมต่อกับเวปไซต์ปลายทางได้'
                )}
              </span>
              <p className="pt-6">
                <a
                  href="https://vote.ptp.or.th/"
                  target="_blank"
                  rel="noreferrer"
                  className="is-size-6 is-size-4-desktop has-text-white has-text-weight-medium"
                >
                  ปิดโหวตแล้ว (แหล่งที่มาข้อมูล https://vote.ptp.or.th/)
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
