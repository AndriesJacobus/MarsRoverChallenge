import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export default function Model(props) {

  useGLTF.preload(props.model);
  const { nodes, materials } = useGLTF(props.model);

  return (
    <group {...props} dispose={null}>
      <group position={[-0.02, 1.156, 0.082]}>
        <mesh geometry={nodes.Object_4.geometry} material={materials.mars_2020_03} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.mars_2020_01} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.mars_2020_04} />
        <mesh geometry={nodes.Object_7.geometry} material={materials.mars_2020_02} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.mars_2020_04_aluminum_r} />
      </group>
      <group position={[-0.077, 0.724, 0.972]}>
        <mesh geometry={nodes.Object_11.geometry} material={materials.aluminum_black} />
        <mesh geometry={nodes.Object_12.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_13.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_14.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_15.geometry} material={materials.spring} />
        <mesh geometry={nodes.Object_16.geometry} material={materials.mars_2020_06_brass2} />
      </group>
      <group position={[0.088, 0.683, 0.982]}>
        <mesh geometry={nodes.Object_18.geometry} material={materials['aluminum_black.001']} />
        <mesh geometry={nodes.Object_19.geometry} material={materials['mars_2020_04.001']} />
      </group>
      <group position={[0.472, 0.779, -1.142]}>
        <mesh geometry={nodes.Object_21.geometry} material={materials.aluminum_black} />
        <mesh geometry={nodes.Object_22.geometry} material={materials.mars_2020_06_brass2} />
        <mesh geometry={nodes.Object_23.geometry} material={materials.grey_brushed} />
        <mesh geometry={nodes.Object_24.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_25.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_26.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_27.geometry} material={materials.spring} />
      </group>
      <group position={[0.513, 0.815, -1.223]} rotation={[-Math.PI / 4, -0.385, 0]}>
        <mesh geometry={nodes.Object_29.geometry} material={materials.aluminum_black} />
        <mesh geometry={nodes.Object_30.geometry} material={materials.mars_2020_04} />
      </group>
      <group position={[-0.513, 0.815, -1.223]} rotation={[2.356, -0.385, -Math.PI]}>
        <mesh geometry={nodes.Object_32.geometry} material={materials.aluminum_black} />
        <mesh geometry={nodes.Object_33.geometry} material={materials.mars_2020_04} />
      </group>
      <group position={[0, 0.264, -0.035]}>
        <mesh geometry={nodes.Object_39.geometry} material={materials.aluminum_black} />
        <mesh geometry={nodes.Object_40.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_41.geometry} material={materials.material} />
      </group>
      <group position={[0, 0.711, -0.035]}>
        <mesh geometry={nodes.Object_43.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_44.geometry} material={materials.mars_2020_05_gunmetal} />
        <mesh geometry={nodes.Object_45.geometry} material={materials.gunmetal_dark} />
        <mesh geometry={nodes.Object_46.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_47.geometry} material={materials.gray_krinkle} />
        <mesh geometry={nodes.Object_48.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_49.geometry} material={materials.mars_2020_gunmetal_dark} />
      </group>
      <group position={[-0.013, 0.961, 1.12]} rotation={[-Math.PI, 0, 0]} scale={0.034}>
        <mesh geometry={nodes.Object_51.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_52.geometry} material={materials.gunmetal_dark} />
      </group>
      <group position={[0.451, 0.915, 1.176]} rotation={[-Math.PI, -Math.PI / 2, 0]} scale={0.034}>
        <group position={[-4.955, 2.748, 2.321]} rotation={[0, 0, -0.283]}>
          <group position={[-23.488, -6.823, 0.652]} rotation={[0, 0, -1.256]}>
            <group position={[22.473, -0.723, 0.573]} rotation={[0, 0, 1.539]}>
              <group position={[5.245, -4.551, 1.802]} rotation={[-3.136, -1.413, 0.005]} scale={29.848}>
                <group position={[-0.034, 0.176, 0.231]}>
                  <mesh geometry={nodes.Object_90.geometry} material={materials.aluminum} />
                  <mesh geometry={nodes.Object_91.geometry} material={materials.gunmetal} />
                </group>
                <group position={[0.289, 0.168, 0.169]} rotation={[-Math.PI, 0.017, -Math.PI]}>
                  <mesh geometry={nodes.Object_93.geometry} material={materials.gunmetal} />
                  <mesh geometry={nodes.Object_94.geometry} material={materials.glass_2} />
                </group>
                <mesh geometry={nodes.Object_79.geometry} material={materials.gunmetal} />
                <mesh geometry={nodes.Object_80.geometry} material={materials.gunmetal_dark} />
                <mesh geometry={nodes.Object_81.geometry} material={materials.Material} />
                <mesh geometry={nodes.Object_82.geometry} material={materials.foil_orange} />
                <mesh geometry={nodes.Object_83.geometry} material={materials.aluminum} />
                <mesh geometry={nodes.Object_84.geometry} material={materials.paint_white_base} />
                <mesh geometry={nodes.Object_85.geometry} material={materials.bronze} />
                <mesh geometry={nodes.Object_86.geometry} material={materials.mars_2020_07} />
                <mesh geometry={nodes.Object_87.geometry} material={materials.mars_2020_06} />
                <mesh geometry={nodes.Object_88.geometry} material={materials.arm_graphics} />
              </group>
              <mesh geometry={nodes.Object_76.geometry} material={materials.gunmetal} />
              <mesh geometry={nodes.Object_77.geometry} material={materials.gunmetal_dark} />
            </group>
            <mesh geometry={nodes.Object_67.geometry} material={materials.gunmetal_dark} />
            <mesh geometry={nodes.Object_68.geometry} material={materials.paint_white_base} />
            <mesh geometry={nodes.Object_69.geometry} material={materials.mars_2020_07} />
            <mesh geometry={nodes.Object_70.geometry} material={materials.gunmetal} />
            <mesh geometry={nodes.Object_71.geometry} material={materials.foil_orange} />
            <mesh geometry={nodes.Object_72.geometry} material={materials.arm_graphics} />
            <mesh geometry={nodes.Object_73.geometry} material={materials.mars_2020_02_n} />
            <mesh geometry={nodes.Object_74.geometry} material={materials.bronze} />
          </group>
          <mesh geometry={nodes.Object_59.geometry} material={materials.paint_white_base} />
          <mesh geometry={nodes.Object_60.geometry} material={materials.gunmetal_dark} />
          <mesh geometry={nodes.Object_61.geometry} material={materials.mars_2020_07} />
          <mesh geometry={nodes.Object_62.geometry} material={materials.gunmetal} />
          <mesh geometry={nodes.Object_63.geometry} material={materials.arm_graphics} />
          <mesh geometry={nodes.Object_64.geometry} material={materials.mars_2020_02_n} />
          <mesh geometry={nodes.Object_65.geometry} material={materials.bronze} />
        </group>
        <mesh geometry={nodes.Object_54.geometry} material={materials.gunmetal_dark} />
        <mesh geometry={nodes.Object_55.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_56.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_57.geometry} material={materials.foil_orange} />
      </group>
      <group position={[-0.021, 1.131, 0.809]} rotation={[2.713, -0.769, 0.429]} scale={[0.137, 0.251, 0.137]}>
        <mesh geometry={nodes.Object_127.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_128.geometry} material={materials.mars_2020_05_aluminum} />
        <mesh geometry={nodes.Object_129.geometry} material={materials.mars_2020_05_brass} />
        <mesh geometry={nodes.Object_130.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_131.geometry} material={materials.mars_2020_05_gunmetal} />
        <mesh geometry={nodes.Object_132.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_133.geometry} material={materials.mars_2020_01} />
        <mesh geometry={nodes.Object_134.geometry} material={materials.arm_graphics} />
        <mesh geometry={nodes.Object_135.geometry} material={materials.spring} />
      </group>
      <group position={[0, 1.156, -1.249]}>
        <mesh geometry={nodes.Object_137.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_138.geometry} material={materials.mars_2020_05_cooling_lines} />
        <mesh geometry={nodes.Object_139.geometry} material={materials.mars_2020_04} />
        <mesh geometry={nodes.Object_140.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_141.geometry} material={materials.mars_2020_06_brass2} />
        <mesh geometry={nodes.Object_142.geometry} material={materials.copper} />
        <mesh geometry={nodes.Object_143.geometry} material={materials.mars_2020_03} />
        <mesh geometry={nodes.Object_144.geometry} material={materials.array_gold_trim} />
        <mesh geometry={nodes.Object_145.geometry} material={materials.gold} />
        <mesh geometry={nodes.Object_146.geometry} material={materials.aluminum_black} />
        <mesh geometry={nodes.Object_147.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_148.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_149.geometry} material={materials.gunmetal_dark} />
      </group>
      <group position={[-0.505, 1.64, -1.083]} scale={[0.083, 0.093, 0.083]}>
        <mesh geometry={nodes.Object_151.geometry} material={materials.black_krinkle} />
        <mesh geometry={nodes.Object_152.geometry} material={materials.gunmetal_dark} />
      </group>
      <group position={[0.418, 1.284, -0.394]}>
        <mesh geometry={nodes.Object_154.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_155.geometry} material={materials.mars_2020_01} />
        <mesh geometry={nodes.Object_156.geometry} material={materials.brass} />
        <mesh geometry={nodes.Object_157.geometry} material={materials.gunmetal} />
      </group>
      <group position={[0.495, 1.509, -0.939]} rotation={[-Math.PI, 0, 0]} scale={0.001}>
        <mesh geometry={nodes.Object_159.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_160.geometry} material={materials.mars_2020_06_brass2} />
      </group>
      <group position={[0.611, 0.712, 0.831]}>
        <mesh geometry={nodes.Object_162.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_163.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_164.geometry} material={materials.grey_brushed} />
      </group>
      <group position={[-0.611, 0.715, 0.831]}>
        <mesh geometry={nodes.Object_166.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_167.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_168.geometry} material={materials.grey_brushed} />
      </group>
      <group position={[-0.02, 1.156, 0.082]}>
        <mesh geometry={nodes.Object_170.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_171.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_172.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_173.geometry} material={materials.gunmetal_dark} />
      </group>
      <group position={[0, 1.46, -0.906]}>
        <mesh geometry={nodes.Object_177.geometry} material={materials.mars_2020_04} />
        <mesh geometry={nodes.Object_178.geometry} material={materials.arm_graphics} />
        <mesh geometry={nodes.Object_179.geometry} material={materials.grey_brushed} />
        <mesh geometry={nodes.Object_180.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_181.geometry} material={materials.glass_2} />
        <mesh geometry={nodes.Object_182.geometry} material={materials.nameplate} />
      </group>
      <group position={[-0.626, 1.245, 0.606]}>
        <group position={[-0.038, 0.356, 0.13]}>
          <mesh geometry={nodes.Object_193.geometry} material={materials.paint_white_base} />
          <mesh geometry={nodes.Object_194.geometry} material={materials.mars_2020_03} />
        </group>
        <group position={[0.073, 0.255, 0.08]}>
          <mesh geometry={nodes.Object_196.geometry} material={materials.paint_white_base} />
          <mesh geometry={nodes.Object_197.geometry} material={materials.bronze} />
          <mesh geometry={nodes.Object_198.geometry} material={materials.aluminum} />
          <mesh geometry={nodes.Object_199.geometry} material={materials.mars_2020_01_n} />
        </group>
        <group position={[-0.136, 0.372, -0.061]}>
          <mesh geometry={nodes.Object_201.geometry} material={materials['aluminum.003']} />
          <mesh geometry={nodes.Object_202.geometry} material={materials['mars_2020_03.002']} />
        </group>
        <group position={[0.07, 0.548, 0.107]}>
          <mesh geometry={nodes.Object_204.geometry} material={materials.paint_white_base} />
          <mesh geometry={nodes.Object_205.geometry} material={materials.gunmetal} />
          <mesh geometry={nodes.Object_206.geometry} material={materials.mars_2020_06_brass2} />
          <mesh geometry={nodes.Object_207.geometry} material={materials.mars_2020_01_n} />
          <mesh geometry={nodes.Object_208.geometry} material={materials.bronze} />
          <mesh geometry={nodes.Object_209.geometry} material={materials.gunmetal_dark} />
          <mesh geometry={nodes.Object_210.geometry} material={materials['aluminum.001']} />
          <mesh geometry={nodes.Object_211.geometry} material={materials.mars_2020_02_n} />
        </group>
        <mesh geometry={nodes.Object_184.geometry} material={materials.mars_2020_01_n} />
        <mesh geometry={nodes.Object_185.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_186.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_187.geometry} material={materials.mars_2020_06_brass2} />
        <mesh geometry={nodes.Object_188.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_189.geometry} material={materials.mars_2020_02_n} />
        <mesh geometry={nodes.Object_190.geometry} material={materials.bronze} />
        <mesh geometry={nodes.Object_191.geometry} material={materials.blades} />
      </group>
      <group position={[-0.522, 1.922, 0.713]}>
        <group position={[0.078, 0.214, 0.068]}>
          <mesh geometry={nodes.Object_223.geometry} material={materials.gunmetal} />
          <mesh geometry={nodes.Object_224.geometry} material={materials.mars_2020_02} />
          <mesh geometry={nodes.Object_225.geometry} material={materials.paint_white_base} />
          <mesh geometry={nodes.Object_226.geometry} material={materials.glass_2} />
        </group>
        <group position={[-0.032, 0.135, 0.002]}>
          <mesh geometry={nodes.Object_228.geometry} material={materials.mars_2020_02} />
          <mesh geometry={nodes.Object_229.geometry} material={materials.paint_white_base} />
          <mesh geometry={nodes.Object_230.geometry} material={materials.mars_2020_06_brass2} />
          <mesh geometry={nodes.Object_231.geometry} material={materials.aluminum_black} />
          <mesh geometry={nodes.Object_232.geometry} material={materials.gunmetal} />
          <mesh geometry={nodes.Object_233.geometry} material={materials.glass_2} />
        </group>
        <group position={[-0.033, 0.05, 0.053]}>
          <mesh geometry={nodes.Object_237.geometry} material={materials.paint_white_base} />
          <mesh geometry={nodes.Object_238.geometry} material={materials.mars_2020_02} />
          <mesh geometry={nodes.Object_239.geometry} material={materials.aluminum_black} />
          <mesh geometry={nodes.Object_240.geometry} material={materials.mars_2020_05} />
          <mesh geometry={nodes.Object_241.geometry} material={materials.glass_2} />
          <mesh geometry={nodes.Object_242.geometry} material={materials.aluminum} />
          <mesh geometry={nodes.Object_243.geometry} material={materials.mars_2020_06_brass2} />
        </group>
        <mesh geometry={nodes.Object_213.geometry} material={materials.mars_2020_02} />
        <mesh geometry={nodes.Object_214.geometry} material={materials.mars_2020_03} />
        <mesh geometry={nodes.Object_215.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_216.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_217.geometry} material={materials.bronze} />
        <mesh geometry={nodes.Object_218.geometry} material={materials.mars_2020_06_brass2} />
        <mesh geometry={nodes.Object_219.geometry} material={materials.mars_2020_01_n} />
        <mesh geometry={nodes.Object_220.geometry} material={materials.aluminum_black} />
        <mesh geometry={nodes.Object_221.geometry} material={materials.mars_2020_02_n} />
        <mesh geometry={nodes.Object_235.geometry} material={materials.grey_brushed} position={[0.015, 0.154, 0.124]} />
      </group>
      <group position={[-0.563, 1.211, 0.72]}>
        <mesh geometry={nodes.Object_245.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_246.geometry} material={materials.gunmetal} />
      </group>
      <group position={[-0.626, 1.245, 0.606]}>
        <mesh geometry={nodes.Object_248.geometry} material={materials.bronze} />
        <mesh geometry={nodes.Object_249.geometry} material={materials.mars_2020_02_n} />
      </group>
      <group position={[-0.388, 1.33, -0.603]}>
        <mesh geometry={nodes.Object_251.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_252.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_253.geometry} material={materials.glass_lens} />
      </group>
      <group position={[0.647, 0.779, 0.668]}>
        <mesh geometry={nodes.Object_255.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_256.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_257.geometry} material={materials.mars_2020_05} />
      </group>
      <group position={[-0.414, 0.664, -0.232]}>
        <group position={[-0.007, -0.003, 0.042]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.Object_261.geometry} material={materials.transparent} />
          <mesh geometry={nodes.Object_263.geometry} material={materials.gunmetal} position={[-0.068, -0.048, 0.005]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={0.001} />
        </group>
        <mesh geometry={nodes.Object_259.geometry} material={materials.aluminum} />
      </group>
      <group position={[0.019, 0.702, -0.259]}>
        <group position={[0, -0.002, 0.112]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <group position={[-0.083, 0.09, 0.01]} rotation={[Math.PI / 2, 0, -Math.PI]}>
            <mesh geometry={nodes.Object_269.geometry} material={materials.gunmetal} />
            <mesh geometry={nodes.Object_270.geometry} material={materials.iron} />
          </group>
          <mesh geometry={nodes.Object_267.geometry} material={materials.transparent} />
          <mesh geometry={nodes.Object_272.geometry} material={materials.iron} position={[-0.083, 0.09, 0.01]} rotation={[Math.PI / 2, 0, -Math.PI]} />
        </group>
        <mesh geometry={nodes.Object_265.geometry} material={materials.aluminum} />
      </group>
      <group position={[-0.02, 1.156, 0.082]}>
        <mesh geometry={nodes.Object_276.geometry} material={materials.mars_2020_04} />
        <mesh geometry={nodes.Object_277.geometry} material={materials.mars_2020_01} />
        <mesh geometry={nodes.Object_278.geometry} material={materials.mars_2020_02} />
        <mesh geometry={nodes.Object_279.geometry} material={materials.mars_2020_03} />
        <mesh geometry={nodes.Object_280.geometry} material={materials.mars_2020_06_n} />
        <mesh geometry={nodes.Object_281.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_282.geometry} material={materials.gunmetal_dark} />
        <mesh geometry={nodes.Object_283.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_284.geometry} material={materials.mars_2020_06_brass2} />
        <mesh geometry={nodes.Object_285.geometry} material={materials.brass} />
        <mesh geometry={nodes.Object_286.geometry} material={materials.grey_brushed} />
        <mesh geometry={nodes.Object_287.geometry} material={materials.spring} />
        <mesh geometry={nodes.Object_288.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_289.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_290.geometry} material={materials.aluminum_black} />
        <mesh geometry={nodes.Object_291.geometry} material={materials.mars_2020_04_aluminum_r} />
        <mesh geometry={nodes.Object_292.geometry} material={materials['aluminum_black.001']} />
        <mesh geometry={nodes.Object_293.geometry} material={materials.blades} />
        <mesh geometry={nodes.Object_294.geometry} material={materials.covidPlaque} />
      </group>
      <group position={[-0.488, 0.88, 1.227]} rotation={[-Math.PI, Math.PI / 2, 0]} scale={0.001}>
        <mesh geometry={nodes.Object_296.geometry} material={materials.sample_handling_door} />
        <mesh geometry={nodes.Object_297.geometry} material={materials.gunmetal} />
      </group>
      <group position={[-0.02, 1.156, 0.082]}>
        <mesh geometry={nodes.Object_299.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_300.geometry} material={materials.gunmetal_dark} />
        <mesh geometry={nodes.Object_301.geometry} material={materials.mars_2020_01} />
      </group>
      <group position={[-0.02, 1.156, 0.082]}>
        <mesh geometry={nodes.Object_305.geometry} material={materials.mars_2020_06} />
        <mesh geometry={nodes.Object_306.geometry} material={materials.gunmetal_dark} />
        <mesh geometry={nodes.Object_307.geometry} material={materials.aluminum} />
        <mesh geometry={nodes.Object_308.geometry} material={materials.mars_2020_05} />
        <mesh geometry={nodes.Object_309.geometry} material={materials.mars_2020_01} />
      </group>
      <group position={[0.538, 1.145, 0.872]} rotation={[-Math.PI, 0, 0]} scale={0.034}>
        <mesh geometry={nodes.Object_311.geometry} material={materials.mars_2020_07} />
        <mesh geometry={nodes.Object_312.geometry} material={materials.paint_white_base} />
        <mesh geometry={nodes.Object_313.geometry} material={materials.gunmetal} />
        <mesh geometry={nodes.Object_314.geometry} material={materials.mars_2020_02_n} />
        <mesh geometry={nodes.Object_315.geometry} material={materials.bronze} />
        <mesh geometry={nodes.Object_316.geometry} material={materials.mars_2020_02} />
      </group>
      <mesh geometry={nodes.Object_35.geometry} material={materials.grey_brushed} position={[0.472, 0.779, -1.142]} />
      <mesh geometry={nodes.Object_37.geometry} material={materials.grey_brushed} position={[0.61, 1.014, -0.3]} />
      <mesh geometry={nodes.Object_175.geometry} material={materials.mars_2020_01} position={[0, 0.779, -1.056]} />
      <mesh geometry={nodes.Object_274.geometry} material={materials.aluminum} position={[-0.191, 0.673, -0.84]} />
      <mesh geometry={nodes.Object_303.geometry} material={materials.gunmetal_dark} position={[-0.02, 1.156, 0.082]} />
    </group>
  )
}
