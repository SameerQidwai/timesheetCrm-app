import React from 'react'
import { StyleSheet } from 'react-native'
import { Caption } from 'react-native-paper'
import { status_name } from '../../services/constant'

function StatusTag({status}) {
  return (
    <Caption style={[status_tag_color[status]]}>
        {status_name[status]}
    </Caption>
  )
}

export default StatusTag

export const status_tag_color = StyleSheet.create({
    'AP': { borderColor: '#b7eb8f', borderWidth: 1, borderRadius: 3, paddingHorizontal: 3, lineHeight: 15, color: '#5da647' },
    'RJ': { borderColor: '#ffa39e', borderWidth: 1, borderRadius: 3, paddingHorizontal: 3, lineHeight: 15, color: '#a64747' },
    'SB': { borderColor: '#8fb2eb', borderWidth: 1, borderRadius: 3, paddingHorizontal: 3, lineHeight: 15, color: '#476ba6' },
    // 'SV': { borderColor: '#c4c4c4', borderWidth: 1, borderRadius: 3, paddingHorizontal: 3 },
  })