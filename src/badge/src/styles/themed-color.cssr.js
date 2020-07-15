import { c, cTB, cB, cM } from '../../../_utils/cssr'

function createRippleAnimation (digest, color, theme) {
  return [
    c(`@keyframes ${theme && theme + '-'}${digest}-badge-wave-spread`, {
      from: {
        boxShadow: `0 0 0.5px 0px ${color}`
      },
      to: {
        // don't use exact 5px since chrome will display the animation with glitches
        boxShadow: `0 0 0.5px 4.5px ${color}`
      }
    }),
    c(`@keyframes ${theme && theme + '-'}${digest}-badge-wave-opacity`, {
      from: {
        opacity: 0.6
      },
      to: {
        opacity: 0
      }
    })
  ]
}

export default c([
  ({ props }) => {
    let digest
    let color
    if (props.colorDigest) {
      digest = props.colorDigest
      color = props.color
    } else {
      digest = props.$instance.type
      color = props.$local[digest].color
    }
    const base = props.$base
    const theme = props.$renderedTheme
    return [
      createRippleAnimation(digest, color, theme),
      cTB('badge', [
        cM(digest + '-colored', [
          cB('badge-sup', {
            background: color
          }, [
            cB('base-wave', {
              zIndex: 1,
              animationDuration: '2s, 2s',
              animationIterationCount: 'infinite',
              animationDelay: '1s, 1s',
              animationTimingFunction: `${base.easeOutCubicBezier}, ${base.easeOutCubicBezier}`,
              animationName: `${theme && theme + '-'}${digest}-badge-wave-spread, ${theme && theme + '-'}${digest}-badge-wave-opacity`
            })
          ])
        ])
      ])
    ]
  }
])