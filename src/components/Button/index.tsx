import React from 'react'
import { Button as TaroButton } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'

type ButtonType = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'normal' | 'large' | 'small'

interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  block?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  size = 'normal',
  block,
  disabled,
  onClick,
  children
}) => {
  const cls = classnames(styles.container, {
    [styles.primary]: type === 'primary',
    [styles.secondary]: type === 'secondary',
    [styles.outline]: type === 'outline',
    [styles.ghost]: type === 'ghost',
    [styles.block]: block,
    [styles.large]: size === 'large',
    [styles.small]: size === 'small',
    [styles.disabled]: disabled
  })

  return (
    <TaroButton className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </TaroButton>
  )
}

export default Button
