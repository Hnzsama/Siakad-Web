<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regencies = [
            [
                "code" => 1101,
                "province_code" => 11,
                "name" => "KAB. ACEH SELATAN"
            ],
            [
                "code" => 1102,
                "province_code" => 11,
                "name" => "KAB. ACEH TENGGARA"
            ],
            [
                "code" => 1103,
                "province_code" => 11,
                "name" => "KAB. ACEH TIMUR"
            ],
            [
                "code" => 1104,
                "province_code" => 11,
                "name" => "KAB. ACEH TENGAH"
            ],
            [
                "code" => 1105,
                "province_code" => 11,
                "name" => "KAB. ACEH BARAT"
            ],
            [
                "code" => 1106,
                "province_code" => 11,
                "name" => "KAB. ACEH BESAR"
            ],
            [
                "code" => 1107,
                "province_code" => 11,
                "name" => "KAB. PIDIE"
            ],
            [
                "code" => 1108,
                "province_code" => 11,
                "name" => "KAB. ACEH UTARA"
            ],
            [
                "code" => 1109,
                "province_code" => 11,
                "name" => "KAB. SIMEULUE"
            ],
            [
                "code" => 1110,
                "province_code" => 11,
                "name" => "KAB. ACEH SINGKIL"
            ],
            [
                "code" => 1111,
                "province_code" => 11,
                "name" => "KAB. BIREUEN"
            ],
            [
                "code" => 1112,
                "province_code" => 11,
                "name" => "KAB. ACEH BARAT DAYA"
            ],
            [
                "code" => 1113,
                "province_code" => 11,
                "name" => "KAB. GAYO LUES"
            ],
            [
                "code" => 1114,
                "province_code" => 11,
                "name" => "KAB. ACEH JAYA"
            ],
            [
                "code" => 1115,
                "province_code" => 11,
                "name" => "KAB. NAGAN RAYA"
            ],
            [
                "code" => 1116,
                "province_code" => 11,
                "name" => "KAB. ACEH TAMIANG"
            ],
            [
                "code" => 1117,
                "province_code" => 11,
                "name" => "KAB. BENER MERIAH"
            ],
            [
                "code" => 1118,
                "province_code" => 11,
                "name" => "KAB. PIDIE JAYA"
            ],
            [
                "code" => 1171,
                "province_code" => 11,
                "name" => "KOTA BANDA ACEH"
            ],
            [
                "code" => 1172,
                "province_code" => 11,
                "name" => "KOTA SABANG"
            ],
            [
                "code" => 1173,
                "province_code" => 11,
                "name" => "KOTA LHOKSEUMAWE"
            ],
            [
                "code" => 1174,
                "province_code" => 11,
                "name" => "KOTA LANGSA"
            ],
            [
                "code" => 1175,
                "province_code" => 11,
                "name" => "KOTA SUBULUSSALAM"
            ],
            [
                "code" => 1201,
                "province_code" => 12,
                "name" => "KAB. TAPANULI TENGAH"
            ],
            [
                "code" => 1202,
                "province_code" => 12,
                "name" => "KAB. TAPANULI UTARA"
            ],
            [
                "code" => 1203,
                "province_code" => 12,
                "name" => "KAB. TAPANULI SELATAN"
            ],
            [
                "code" => 1204,
                "province_code" => 12,
                "name" => "KAB. NIAS"
            ],
            [
                "code" => 1205,
                "province_code" => 12,
                "name" => "KAB. LANGKAT"
            ],
            [
                "code" => 1206,
                "province_code" => 12,
                "name" => "KAB. KARO"
            ],
            [
                "code" => 1207,
                "province_code" => 12,
                "name" => "KAB. DELI SERDANG"
            ],
            [
                "code" => 1208,
                "province_code" => 12,
                "name" => "KAB. SIMALUNGUN"
            ],
            [
                "code" => 1209,
                "province_code" => 12,
                "name" => "KAB. ASAHAN"
            ],
            [
                "code" => 1210,
                "province_code" => 12,
                "name" => "KAB. LABUHANBATU"
            ],
            [
                "code" => 1211,
                "province_code" => 12,
                "name" => "KAB. DAIRI"
            ],
            [
                "code" => 1212,
                "province_code" => 12,
                "name" => "KAB. TOBA"
            ],
            [
                "code" => 1213,
                "province_code" => 12,
                "name" => "KAB. MANDAILING NATAL"
            ],
            [
                "code" => 1214,
                "province_code" => 12,
                "name" => "KAB. NIAS SELATAN"
            ],
            [
                "code" => 1215,
                "province_code" => 12,
                "name" => "KAB. PAKPAK BHARAT"
            ],
            [
                "code" => 1216,
                "province_code" => 12,
                "name" => "KAB. HUMBANG HASUNDUTAN"
            ],
            [
                "code" => 1217,
                "province_code" => 12,
                "name" => "KAB. SAMOSIR"
            ],
            [
                "code" => 1218,
                "province_code" => 12,
                "name" => "KAB. SERDANG BEDAGAI"
            ],
            [
                "code" => 1219,
                "province_code" => 12,
                "name" => "KAB. BATU BARA"
            ],
            [
                "code" => 1220,
                "province_code" => 12,
                "name" => "KAB. PADANG LAWAS UTARA"
            ],
            [
                "code" => 1221,
                "province_code" => 12,
                "name" => "KAB. PADANG LAWAS"
            ],
            [
                "code" => 1222,
                "province_code" => 12,
                "name" => "KAB. LABUHANBATU SELATAN"
            ],
            [
                "code" => 1223,
                "province_code" => 12,
                "name" => "KAB. LABUHANBATU UTARA"
            ],
            [
                "code" => 1224,
                "province_code" => 12,
                "name" => "KAB. NIAS UTARA"
            ],
            [
                "code" => 1225,
                "province_code" => 12,
                "name" => "KAB. NIAS BARAT"
            ],
            [
                "code" => 1271,
                "province_code" => 12,
                "name" => "KOTA MEDAN"
            ],
            [
                "code" => 1272,
                "province_code" => 12,
                "name" => "KOTA PEMATANGSIANTAR"
            ],
            [
                "code" => 1273,
                "province_code" => 12,
                "name" => "KOTA SIBOLGA"
            ],
            [
                "code" => 1274,
                "province_code" => 12,
                "name" => "KOTA TANJUNG BALAI"
            ],
            [
                "code" => 1275,
                "province_code" => 12,
                "name" => "KOTA BINJAI"
            ],
            [
                "code" => 1276,
                "province_code" => 12,
                "name" => "KOTA TEBING TINGGI"
            ],
            [
                "code" => 1277,
                "province_code" => 12,
                "name" => "KOTA PADANGSIDIMPUAN"
            ],
            [
                "code" => 1278,
                "province_code" => 12,
                "name" => "KOTA GUNUNGSITOLI"
            ],
            [
                "code" => 1301,
                "province_code" => 13,
                "name" => "KAB. PESISIR SELATAN"
            ],
            [
                "code" => 1302,
                "province_code" => 13,
                "name" => "KAB. SOLOK"
            ],
            [
                "code" => 1303,
                "province_code" => 13,
                "name" => "KAB. SIJUNJUNG"
            ],
            [
                "code" => 1304,
                "province_code" => 13,
                "name" => "KAB. TANAH DATAR"
            ],
            [
                "code" => 1305,
                "province_code" => 13,
                "name" => "KAB. PADANG PARIAMAN"
            ],
            [
                "code" => 1306,
                "province_code" => 13,
                "name" => "KAB. AGAM"
            ],
            [
                "code" => 1307,
                "province_code" => 13,
                "name" => "KAB. LIMA PULUH KOTA"
            ],
            [
                "code" => 1308,
                "province_code" => 13,
                "name" => "KAB. PASAMAN"
            ],
            [
                "code" => 1309,
                "province_code" => 13,
                "name" => "KAB. KEPULAUAN MENTAWAI"
            ],
            [
                "code" => 1310,
                "province_code" => 13,
                "name" => "KAB. DHARMASRAYA"
            ],
            [
                "code" => 1311,
                "province_code" => 13,
                "name" => "KAB. SOLOK SELATAN"
            ],
            [
                "code" => 1312,
                "province_code" => 13,
                "name" => "KAB. PASAMAN BARAT"
            ],
            [
                "code" => 1371,
                "province_code" => 13,
                "name" => "KOTA PADANG"
            ],
            [
                "code" => 1372,
                "province_code" => 13,
                "name" => "KOTA SOLOK"
            ],
            [
                "code" => 1373,
                "province_code" => 13,
                "name" => "KOTA SAWAHLUNTO"
            ],
            [
                "code" => 1374,
                "province_code" => 13,
                "name" => "KOTA PADANG PANJANG"
            ],
            [
                "code" => 1375,
                "province_code" => 13,
                "name" => "KOTA BUKITTINGGI"
            ],
            [
                "code" => 1376,
                "province_code" => 13,
                "name" => "KOTA PAYAKUMBUH"
            ],
            [
                "code" => 1377,
                "province_code" => 13,
                "name" => "KOTA PARIAMAN"
            ],
            [
                "code" => 1401,
                "province_code" => 14,
                "name" => "KAB. KAMPAR"
            ],
            [
                "code" => 1402,
                "province_code" => 14,
                "name" => "KAB. INDRAGIRI HULU"
            ],
            [
                "code" => 1403,
                "province_code" => 14,
                "name" => "KAB. BENGKALIS"
            ],
            [
                "code" => 1404,
                "province_code" => 14,
                "name" => "KAB. INDRAGIRI HILIR"
            ],
            [
                "code" => 1405,
                "province_code" => 14,
                "name" => "KAB. PELALAWAN"
            ],
            [
                "code" => 1406,
                "province_code" => 14,
                "name" => "KAB. ROKAN HULU"
            ],
            [
                "code" => 1407,
                "province_code" => 14,
                "name" => "KAB. ROKAN HILIR"
            ],
            [
                "code" => 1408,
                "province_code" => 14,
                "name" => "KAB. SIAK"
            ],
            [
                "code" => 1409,
                "province_code" => 14,
                "name" => "KAB. KUANTAN SINGINGI"
            ],
            [
                "code" => 1410,
                "province_code" => 14,
                "name" => "KAB. KEPULAUAN MERANTI"
            ],
            [
                "code" => 1471,
                "province_code" => 14,
                "name" => "KOTA PEKANBARU"
            ],
            [
                "code" => 1472,
                "province_code" => 14,
                "name" => "KOTA DUMAI"
            ],
            [
                "code" => 1501,
                "province_code" => 15,
                "name" => "KAB. KERINCI"
            ],
            [
                "code" => 1502,
                "province_code" => 15,
                "name" => "KAB. MERANGIN"
            ],
            [
                "code" => 1503,
                "province_code" => 15,
                "name" => "KAB. SAROLANGUN"
            ],
            [
                "code" => 1504,
                "province_code" => 15,
                "name" => "KAB. BATANGHARI"
            ],
            [
                "code" => 1505,
                "province_code" => 15,
                "name" => "KAB. MUARO JAMBI"
            ],
            [
                "code" => 1506,
                "province_code" => 15,
                "name" => "KAB. TANJUNG JABUNG BARAT"
            ],
            [
                "code" => 1507,
                "province_code" => 15,
                "name" => "KAB. TANJUNG JABUNG TIMUR"
            ],
            [
                "code" => 1508,
                "province_code" => 15,
                "name" => "KAB. BUNGO"
            ],
            [
                "code" => 1509,
                "province_code" => 15,
                "name" => "KAB. TEBO"
            ],
            [
                "code" => 1571,
                "province_code" => 15,
                "name" => "KOTA JAMBI"
            ],
            [
                "code" => 1572,
                "province_code" => 15,
                "name" => "KOTA SUNGAI PENUH"
            ],
            [
                "code" => 1601,
                "province_code" => 16,
                "name" => "KAB. OGAN KOMERING ULU"
            ],
            [
                "code" => 1602,
                "province_code" => 16,
                "name" => "KAB. OGAN KOMERING ILIR"
            ],
            [
                "code" => 1603,
                "province_code" => 16,
                "name" => "KAB. MUARA ENIM"
            ],
            [
                "code" => 1604,
                "province_code" => 16,
                "name" => "KAB. LAHAT"
            ],
            [
                "code" => 1605,
                "province_code" => 16,
                "name" => "KAB. MUSI RAWAS"
            ],
            [
                "code" => 1606,
                "province_code" => 16,
                "name" => "KAB. MUSI BANYUASIN"
            ],
            [
                "code" => 1607,
                "province_code" => 16,
                "name" => "KAB. BANYUASIN"
            ],
            [
                "code" => 1608,
                "province_code" => 16,
                "name" => "KAB. OGAN KOMERING ULU TIMUR"
            ],
            [
                "code" => 1609,
                "province_code" => 16,
                "name" => "KAB. OGAN KOMERING ULU SELATAN"
            ],
            [
                "code" => 1610,
                "province_code" => 16,
                "name" => "KAB. OGAN ILIR"
            ],
            [
                "code" => 1611,
                "province_code" => 16,
                "name" => "KAB. EMPAT LAWANG"
            ],
            [
                "code" => 1612,
                "province_code" => 16,
                "name" => "KAB. PENUKAL ABAB LEMATANG ILIR"
            ],
            [
                "code" => 1613,
                "province_code" => 16,
                "name" => "KAB. MUSI RAWAS UTARA"
            ],
            [
                "code" => 1671,
                "province_code" => 16,
                "name" => "KOTA PALEMBANG"
            ],
            [
                "code" => 1672,
                "province_code" => 16,
                "name" => "KOTA PAGAR ALAM"
            ],
            [
                "code" => 1673,
                "province_code" => 16,
                "name" => "KOTA LUBUK LINGGAU"
            ],
            [
                "code" => 1674,
                "province_code" => 16,
                "name" => "KOTA PRABUMULIH"
            ],
            [
                "code" => 1701,
                "province_code" => 17,
                "name" => "KAB. BENGKULU SELATAN"
            ],
            [
                "code" => 1702,
                "province_code" => 17,
                "name" => "KAB. REJANG LEBONG"
            ],
            [
                "code" => 1703,
                "province_code" => 17,
                "name" => "KAB. BENGKULU UTARA"
            ],
            [
                "code" => 1704,
                "province_code" => 17,
                "name" => "KAB. KAUR"
            ],
            [
                "code" => 1705,
                "province_code" => 17,
                "name" => "KAB. SELUMA"
            ],
            [
                "code" => 1706,
                "province_code" => 17,
                "name" => "KAB. MUKO MUKO"
            ],
            [
                "code" => 1707,
                "province_code" => 17,
                "name" => "KAB. LEBONG"
            ],
            [
                "code" => 1708,
                "province_code" => 17,
                "name" => "KAB. KEPAHIANG"
            ],
            [
                "code" => 1709,
                "province_code" => 17,
                "name" => "KAB. BENGKULU TENGAH"
            ],
            [
                "code" => 1771,
                "province_code" => 17,
                "name" => "KOTA BENGKULU"
            ],
            [
                "code" => 1801,
                "province_code" => 18,
                "name" => "KAB. LAMPUNG SELATAN"
            ],
            [
                "code" => 1802,
                "province_code" => 18,
                "name" => "KAB. LAMPUNG TENGAH"
            ],
            [
                "code" => 1803,
                "province_code" => 18,
                "name" => "KAB. LAMPUNG UTARA"
            ],
            [
                "code" => 1804,
                "province_code" => 18,
                "name" => "KAB. LAMPUNG BARAT"
            ],
            [
                "code" => 1805,
                "province_code" => 18,
                "name" => "KAB. TULANG BAWANG"
            ],
            [
                "code" => 1806,
                "province_code" => 18,
                "name" => "KAB. TANGGAMUS"
            ],
            [
                "code" => 1807,
                "province_code" => 18,
                "name" => "KAB. LAMPUNG TIMUR"
            ],
            [
                "code" => 1808,
                "province_code" => 18,
                "name" => "KAB. WAY KANAN"
            ],
            [
                "code" => 1809,
                "province_code" => 18,
                "name" => "KAB. PESAWARAN"
            ],
            [
                "code" => 1810,
                "province_code" => 18,
                "name" => "KAB. PRINGSEWU"
            ],
            [
                "code" => 1811,
                "province_code" => 18,
                "name" => "KAB. MESUJI"
            ],
            [
                "code" => 1812,
                "province_code" => 18,
                "name" => "KAB. TULANG BAWANG BARAT"
            ],
            [
                "code" => 1813,
                "province_code" => 18,
                "name" => "KAB. PESISIR BARAT"
            ],
            [
                "code" => 1871,
                "province_code" => 18,
                "name" => "KOTA BANDAR LAMPUNG"
            ],
            [
                "code" => 1872,
                "province_code" => 18,
                "name" => "KOTA METRO"
            ],
            [
                "code" => 1901,
                "province_code" => 19,
                "name" => "KAB. BANGKA"
            ],
            [
                "code" => 1902,
                "province_code" => 19,
                "name" => "KAB. BELITUNG"
            ],
            [
                "code" => 1903,
                "province_code" => 19,
                "name" => "KAB. BANGKA SELATAN"
            ],
            [
                "code" => 1904,
                "province_code" => 19,
                "name" => "KAB. BANGKA TENGAH"
            ],
            [
                "code" => 1905,
                "province_code" => 19,
                "name" => "KAB. BANGKA BARAT"
            ],
            [
                "code" => 1906,
                "province_code" => 19,
                "name" => "KAB. BELITUNG TIMUR"
            ],
            [
                "code" => 1971,
                "province_code" => 19,
                "name" => "KOTA PANGKAL PINANG"
            ],
            [
                "code" => 2101,
                "province_code" => 21,
                "name" => "KAB. BINTAN"
            ],
            [
                "code" => 2102,
                "province_code" => 21,
                "name" => "KAB. KARIMUN"
            ],
            [
                "code" => 2103,
                "province_code" => 21,
                "name" => "KAB. NATUNA"
            ],
            [
                "code" => 2104,
                "province_code" => 21,
                "name" => "KAB. LINGGA"
            ],
            [
                "code" => 2105,
                "province_code" => 21,
                "name" => "KAB. KEPULAUAN ANAMBAS"
            ],
            [
                "code" => 2171,
                "province_code" => 21,
                "name" => "KOTA BATAM"
            ],
            [
                "code" => 2172,
                "province_code" => 21,
                "name" => "KOTA TANJUNG PINANG"
            ],
            [
                "code" => 3101,
                "province_code" => 31,
                "name" => "KAB. ADM. KEP. SERIBU"
            ],
            [
                "code" => 3171,
                "province_code" => 31,
                "name" => "KOTA ADM. JAKARTA PUSAT"
            ],
            [
                "code" => 3172,
                "province_code" => 31,
                "name" => "KOTA ADM. JAKARTA UTARA"
            ],
            [
                "code" => 3173,
                "province_code" => 31,
                "name" => "KOTA ADM. JAKARTA BARAT"
            ],
            [
                "code" => 3174,
                "province_code" => 31,
                "name" => "KOTA ADM. JAKARTA SELATAN"
            ],
            [
                "code" => 3175,
                "province_code" => 31,
                "name" => "KOTA ADM. JAKARTA TIMUR"
            ],
            [
                "code" => 3201,
                "province_code" => 32,
                "name" => "KAB. BOGOR"
            ],
            [
                "code" => 3202,
                "province_code" => 32,
                "name" => "KAB. SUKABUMI"
            ],
            [
                "code" => 3203,
                "province_code" => 32,
                "name" => "KAB. CIANJUR"
            ],
            [
                "code" => 3204,
                "province_code" => 32,
                "name" => "KAB. BANDUNG"
            ],
            [
                "code" => 3205,
                "province_code" => 32,
                "name" => "KAB. GARUT"
            ],
            [
                "code" => 3206,
                "province_code" => 32,
                "name" => "KAB. TASIKMALAYA"
            ],
            [
                "code" => 3207,
                "province_code" => 32,
                "name" => "KAB. CIAMIS"
            ],
            [
                "code" => 3208,
                "province_code" => 32,
                "name" => "KAB. KUNINGAN"
            ],
            [
                "code" => 3209,
                "province_code" => 32,
                "name" => "KAB. CIREBON"
            ],
            [
                "code" => 3210,
                "province_code" => 32,
                "name" => "KAB. MAJALENGKA"
            ],
            [
                "code" => 3211,
                "province_code" => 32,
                "name" => "KAB. SUMEDANG"
            ],
            [
                "code" => 3212,
                "province_code" => 32,
                "name" => "KAB. INDRAMAYU"
            ],
            [
                "code" => 3213,
                "province_code" => 32,
                "name" => "KAB. SUBANG"
            ],
            [
                "code" => 3214,
                "province_code" => 32,
                "name" => "KAB. PURWAKARTA"
            ],
            [
                "code" => 3215,
                "province_code" => 32,
                "name" => "KAB. KARAWANG"
            ],
            [
                "code" => 3216,
                "province_code" => 32,
                "name" => "KAB. BEKASI"
            ],
            [
                "code" => 3217,
                "province_code" => 32,
                "name" => "KAB. BANDUNG BARAT"
            ],
            [
                "code" => 3218,
                "province_code" => 32,
                "name" => "KAB. PANGANDARAN"
            ],
            [
                "code" => 3271,
                "province_code" => 32,
                "name" => "KOTA BOGOR"
            ],
            [
                "code" => 3272,
                "province_code" => 32,
                "name" => "KOTA SUKABUMI"
            ],
            [
                "code" => 3273,
                "province_code" => 32,
                "name" => "KOTA BANDUNG"
            ],
            [
                "code" => 3274,
                "province_code" => 32,
                "name" => "KOTA CIREBON"
            ],
            [
                "code" => 3275,
                "province_code" => 32,
                "name" => "KOTA BEKASI"
            ],
            [
                "code" => 3276,
                "province_code" => 32,
                "name" => "KOTA DEPOK"
            ],
            [
                "code" => 3277,
                "province_code" => 32,
                "name" => "KOTA CIMAHI"
            ],
            [
                "code" => 3278,
                "province_code" => 32,
                "name" => "KOTA TASIKMALAYA"
            ],
            [
                "code" => 3279,
                "province_code" => 32,
                "name" => "KOTA BANJAR"
            ],
            [
                "code" => 3301,
                "province_code" => 33,
                "name" => "KAB. CILACAP"
            ],
            [
                "code" => 3302,
                "province_code" => 33,
                "name" => "KAB. BANYUMAS"
            ],
            [
                "code" => 3303,
                "province_code" => 33,
                "name" => "KAB. PURBALINGGA"
            ],
            [
                "code" => 3304,
                "province_code" => 33,
                "name" => "KAB. BANJARNEGARA"
            ],
            [
                "code" => 3305,
                "province_code" => 33,
                "name" => "KAB. KEBUMEN"
            ],
            [
                "code" => 3306,
                "province_code" => 33,
                "name" => "KAB. PURWOREJO"
            ],
            [
                "code" => 3307,
                "province_code" => 33,
                "name" => "KAB. WONOSOBO"
            ],
            [
                "code" => 3308,
                "province_code" => 33,
                "name" => "KAB. MAGELANG"
            ],
            [
                "code" => 3309,
                "province_code" => 33,
                "name" => "KAB. BOYOLALI"
            ],
            [
                "code" => 3310,
                "province_code" => 33,
                "name" => "KAB. KLATEN"
            ],
            [
                "code" => 3311,
                "province_code" => 33,
                "name" => "KAB. SUKOHARJO"
            ],
            [
                "code" => 3312,
                "province_code" => 33,
                "name" => "KAB. WONOGIRI"
            ],
            [
                "code" => 3313,
                "province_code" => 33,
                "name" => "KAB. KARANGANYAR"
            ],
            [
                "code" => 3314,
                "province_code" => 33,
                "name" => "KAB. SRAGEN"
            ],
            [
                "code" => 3315,
                "province_code" => 33,
                "name" => "KAB. GROBOGAN"
            ],
            [
                "code" => 3316,
                "province_code" => 33,
                "name" => "KAB. BLORA"
            ],
            [
                "code" => 3317,
                "province_code" => 33,
                "name" => "KAB. REMBANG"
            ],
            [
                "code" => 3318,
                "province_code" => 33,
                "name" => "KAB. PATI"
            ],
            [
                "code" => 3319,
                "province_code" => 33,
                "name" => "KAB. KUDUS"
            ],
            [
                "code" => 3320,
                "province_code" => 33,
                "name" => "KAB. JEPARA"
            ],
            [
                "code" => 3321,
                "province_code" => 33,
                "name" => "KAB. DEMAK"
            ],
            [
                "code" => 3322,
                "province_code" => 33,
                "name" => "KAB. SEMARANG"
            ],
            [
                "code" => 3323,
                "province_code" => 33,
                "name" => "KAB. TEMANGGUNG"
            ],
            [
                "code" => 3324,
                "province_code" => 33,
                "name" => "KAB. KENDAL"
            ],
            [
                "code" => 3325,
                "province_code" => 33,
                "name" => "KAB. BATANG"
            ],
            [
                "code" => 3326,
                "province_code" => 33,
                "name" => "KAB. PEKALONGAN"
            ],
            [
                "code" => 3327,
                "province_code" => 33,
                "name" => "KAB. PEMALANG"
            ],
            [
                "code" => 3328,
                "province_code" => 33,
                "name" => "KAB. TEGAL"
            ],
            [
                "code" => 3329,
                "province_code" => 33,
                "name" => "KAB. BREBES"
            ],
            [
                "code" => 3371,
                "province_code" => 33,
                "name" => "KOTA MAGELANG"
            ],
            [
                "code" => 3372,
                "province_code" => 33,
                "name" => "KOTA SURAKARTA"
            ],
            [
                "code" => 3373,
                "province_code" => 33,
                "name" => "KOTA SALATIGA"
            ],
            [
                "code" => 3374,
                "province_code" => 33,
                "name" => "KOTA SEMARANG"
            ],
            [
                "code" => 3375,
                "province_code" => 33,
                "name" => "KOTA PEKALONGAN"
            ],
            [
                "code" => 3376,
                "province_code" => 33,
                "name" => "KOTA TEGAL"
            ],
            [
                "code" => 3401,
                "province_code" => 34,
                "name" => "KAB. KULON PROGO"
            ],
            [
                "code" => 3402,
                "province_code" => 34,
                "name" => "KAB. BANTUL"
            ],
            [
                "code" => 3403,
                "province_code" => 34,
                "name" => "KAB. GUNUNGKIDUL"
            ],
            [
                "code" => 3404,
                "province_code" => 34,
                "name" => "KAB. SLEMAN"
            ],
            [
                "code" => 3471,
                "province_code" => 34,
                "name" => "KOTA YOGYAKARTA"
            ],
            [
                "code" => 3501,
                "province_code" => 35,
                "name" => "KAB. PACITAN"
            ],
            [
                "code" => 3502,
                "province_code" => 35,
                "name" => "KAB. PONOROGO"
            ],
            [
                "code" => 3503,
                "province_code" => 35,
                "name" => "KAB. TRENGGALEK"
            ],
            [
                "code" => 3504,
                "province_code" => 35,
                "name" => "KAB. TULUNGAGUNG"
            ],
            [
                "code" => 3505,
                "province_code" => 35,
                "name" => "KAB. BLITAR"
            ],
            [
                "code" => 3506,
                "province_code" => 35,
                "name" => "KAB. KEDIRI"
            ],
            [
                "code" => 3507,
                "province_code" => 35,
                "name" => "KAB. MALANG"
            ],
            [
                "code" => 3508,
                "province_code" => 35,
                "name" => "KAB. LUMAJANG"
            ],
            [
                "code" => 3509,
                "province_code" => 35,
                "name" => "KAB. JEMBER"
            ],
            [
                "code" => 3510,
                "province_code" => 35,
                "name" => "KAB. BANYUWANGI"
            ],
            [
                "code" => 3511,
                "province_code" => 35,
                "name" => "KAB. BONDOWOSO"
            ],
            [
                "code" => 3512,
                "province_code" => 35,
                "name" => "KAB. SITUBONDO"
            ],
            [
                "code" => 3513,
                "province_code" => 35,
                "name" => "KAB. PROBOLINGGO"
            ],
            [
                "code" => 3514,
                "province_code" => 35,
                "name" => "KAB. PASURUAN"
            ],
            [
                "code" => 3515,
                "province_code" => 35,
                "name" => "KAB. SIDOARJO"
            ],
            [
                "code" => 3516,
                "province_code" => 35,
                "name" => "KAB. MOJOKERTO"
            ],
            [
                "code" => 3517,
                "province_code" => 35,
                "name" => "KAB. JOMBANG"
            ],
            [
                "code" => 3518,
                "province_code" => 35,
                "name" => "KAB. NGANJUK"
            ],
            [
                "code" => 3519,
                "province_code" => 35,
                "name" => "KAB. MADIUN"
            ],
            [
                "code" => 3520,
                "province_code" => 35,
                "name" => "KAB. MAGETAN"
            ],
            [
                "code" => 3521,
                "province_code" => 35,
                "name" => "KAB. NGAWI"
            ],
            [
                "code" => 3522,
                "province_code" => 35,
                "name" => "KAB. BOJONEGORO"
            ],
            [
                "code" => 3523,
                "province_code" => 35,
                "name" => "KAB. TUBAN"
            ],
            [
                "code" => 3524,
                "province_code" => 35,
                "name" => "KAB. LAMONGAN"
            ],
            [
                "code" => 3525,
                "province_code" => 35,
                "name" => "KAB. GRESIK"
            ],
            [
                "code" => 3526,
                "province_code" => 35,
                "name" => "KAB. BANGKALAN"
            ],
            [
                "code" => 3527,
                "province_code" => 35,
                "name" => "KAB. SAMPANG"
            ],
            [
                "code" => 3528,
                "province_code" => 35,
                "name" => "KAB. PAMEKASAN"
            ],
            [
                "code" => 3529,
                "province_code" => 35,
                "name" => "KAB. SUMENEP"
            ],
            [
                "code" => 3571,
                "province_code" => 35,
                "name" => "KOTA KEDIRI"
            ],
            [
                "code" => 3572,
                "province_code" => 35,
                "name" => "KOTA BLITAR"
            ],
            [
                "code" => 3573,
                "province_code" => 35,
                "name" => "KOTA MALANG"
            ],
            [
                "code" => 3574,
                "province_code" => 35,
                "name" => "KOTA PROBOLINGGO"
            ],
            [
                "code" => 3575,
                "province_code" => 35,
                "name" => "KOTA PASURUAN"
            ],
            [
                "code" => 3576,
                "province_code" => 35,
                "name" => "KOTA MOJOKERTO"
            ],
            [
                "code" => 3577,
                "province_code" => 35,
                "name" => "KOTA MADIUN"
            ],
            [
                "code" => 3578,
                "province_code" => 35,
                "name" => "KOTA SURABAYA"
            ],
            [
                "code" => 3579,
                "province_code" => 35,
                "name" => "KOTA BATU"
            ],
            [
                "code" => 3601,
                "province_code" => 36,
                "name" => "KAB. PANDEGLANG"
            ],
            [
                "code" => 3602,
                "province_code" => 36,
                "name" => "KAB. LEBAK"
            ],
            [
                "code" => 3603,
                "province_code" => 36,
                "name" => "KAB. TANGERANG"
            ],
            [
                "code" => 3604,
                "province_code" => 36,
                "name" => "KAB. SERANG"
            ],
            [
                "code" => 3671,
                "province_code" => 36,
                "name" => "KOTA TANGERANG"
            ],
            [
                "code" => 3672,
                "province_code" => 36,
                "name" => "KOTA CILEGON"
            ],
            [
                "code" => 3673,
                "province_code" => 36,
                "name" => "KOTA SERANG"
            ],
            [
                "code" => 3674,
                "province_code" => 36,
                "name" => "KOTA TANGERANG SELATAN"
            ],
            [
                "code" => 5101,
                "province_code" => 51,
                "name" => "KAB. JEMBRANA"
            ],
            [
                "code" => 5102,
                "province_code" => 51,
                "name" => "KAB. TABANAN"
            ],
            [
                "code" => 5103,
                "province_code" => 51,
                "name" => "KAB. BADUNG"
            ],
            [
                "code" => 5104,
                "province_code" => 51,
                "name" => "KAB. GIANYAR"
            ],
            [
                "code" => 5105,
                "province_code" => 51,
                "name" => "KAB. KLUNGKUNG"
            ],
            [
                "code" => 5106,
                "province_code" => 51,
                "name" => "KAB. BANGLI"
            ],
            [
                "code" => 5107,
                "province_code" => 51,
                "name" => "KAB. KARANGASEM"
            ],
            [
                "code" => 5108,
                "province_code" => 51,
                "name" => "KAB. BULELENG"
            ],
            [
                "code" => 5171,
                "province_code" => 51,
                "name" => "KOTA DENPASAR"
            ],
            [
                "code" => 5201,
                "province_code" => 52,
                "name" => "KAB. LOMBOK BARAT"
            ],
            [
                "code" => 5202,
                "province_code" => 52,
                "name" => "KAB. LOMBOK TENGAH"
            ],
            [
                "code" => 5203,
                "province_code" => 52,
                "name" => "KAB. LOMBOK TIMUR"
            ],
            [
                "code" => 5204,
                "province_code" => 52,
                "name" => "KAB. SUMBAWA"
            ],
            [
                "code" => 5205,
                "province_code" => 52,
                "name" => "KAB. DOMPU"
            ],
            [
                "code" => 5206,
                "province_code" => 52,
                "name" => "KAB. BIMA"
            ],
            [
                "code" => 5207,
                "province_code" => 52,
                "name" => "KAB. SUMBAWA BARAT"
            ],
            [
                "code" => 5208,
                "province_code" => 52,
                "name" => "KAB. LOMBOK UTARA"
            ],
            [
                "code" => 5271,
                "province_code" => 52,
                "name" => "KOTA MATARAM"
            ],
            [
                "code" => 5272,
                "province_code" => 52,
                "name" => "KOTA BIMA"
            ],
            [
                "code" => 5301,
                "province_code" => 53,
                "name" => "KAB. KUPANG"
            ],
            [
                "code" => 5302,
                "province_code" => 53,
                "name" => "KAB TIMOR TENGAH SELATAN"
            ],
            [
                "code" => 5303,
                "province_code" => 53,
                "name" => "KAB. TIMOR TENGAH UTARA"
            ],
            [
                "code" => 5304,
                "province_code" => 53,
                "name" => "KAB. BELU"
            ],
            [
                "code" => 5305,
                "province_code" => 53,
                "name" => "KAB. ALOR"
            ],
            [
                "code" => 5306,
                "province_code" => 53,
                "name" => "KAB. FLORES TIMUR"
            ],
            [
                "code" => 5307,
                "province_code" => 53,
                "name" => "KAB. SIKKA"
            ],
            [
                "code" => 5308,
                "province_code" => 53,
                "name" => "KAB. ENDE"
            ],
            [
                "code" => 5309,
                "province_code" => 53,
                "name" => "KAB. NGADA"
            ],
            [
                "code" => 5310,
                "province_code" => 53,
                "name" => "KAB. MANGGARAI"
            ],
            [
                "code" => 5311,
                "province_code" => 53,
                "name" => "KAB. SUMBA TIMUR"
            ],
            [
                "code" => 5312,
                "province_code" => 53,
                "name" => "KAB. SUMBA BARAT"
            ],
            [
                "code" => 5313,
                "province_code" => 53,
                "name" => "KAB. LEMBATA"
            ],
            [
                "code" => 5314,
                "province_code" => 53,
                "name" => "KAB. ROTE NDAO"
            ],
            [
                "code" => 5315,
                "province_code" => 53,
                "name" => "KAB. MANGGARAI BARAT"
            ],
            [
                "code" => 5316,
                "province_code" => 53,
                "name" => "KAB. NAGEKEO"
            ],
            [
                "code" => 5317,
                "province_code" => 53,
                "name" => "KAB. SUMBA TENGAH"
            ],
            [
                "code" => 5318,
                "province_code" => 53,
                "name" => "KAB. SUMBA BARAT DAYA"
            ],
            [
                "code" => 5319,
                "province_code" => 53,
                "name" => "KAB. MANGGARAI TIMUR"
            ],
            [
                "code" => 5320,
                "province_code" => 53,
                "name" => "KAB. SABU RAIJUA"
            ],
            [
                "code" => 5321,
                "province_code" => 53,
                "name" => "KAB. MALAKA"
            ],
            [
                "code" => 5371,
                "province_code" => 53,
                "name" => "KOTA KUPANG"
            ],
            [
                "code" => 6101,
                "province_code" => 61,
                "name" => "KAB. SAMBAS"
            ],
            [
                "code" => 6102,
                "province_code" => 61,
                "name" => "KAB. MEMPAWAH"
            ],
            [
                "code" => 6103,
                "province_code" => 61,
                "name" => "KAB. SANGGAU"
            ],
            [
                "code" => 6104,
                "province_code" => 61,
                "name" => "KAB. KETAPANG"
            ],
            [
                "code" => 6105,
                "province_code" => 61,
                "name" => "KAB. SINTANG"
            ],
            [
                "code" => 6106,
                "province_code" => 61,
                "name" => "KAB. KAPUAS HULU"
            ],
            [
                "code" => 6107,
                "province_code" => 61,
                "name" => "KAB. BENGKAYANG"
            ],
            [
                "code" => 6108,
                "province_code" => 61,
                "name" => "KAB. LANDAK"
            ],
            [
                "code" => 6109,
                "province_code" => 61,
                "name" => "KAB. SEKADAU"
            ],
            [
                "code" => 6110,
                "province_code" => 61,
                "name" => "KAB. MELAWI"
            ],
            [
                "code" => 6111,
                "province_code" => 61,
                "name" => "KAB. KAYONG UTARA"
            ],
            [
                "code" => 6112,
                "province_code" => 61,
                "name" => "KAB. KUBU RAYA"
            ],
            [
                "code" => 6171,
                "province_code" => 61,
                "name" => "KOTA PONTIANAK"
            ],
            [
                "code" => 6172,
                "province_code" => 61,
                "name" => "KOTA SINGKAWANG"
            ],
            [
                "code" => 6201,
                "province_code" => 62,
                "name" => "KAB. KOTAWARINGIN BARAT"
            ],
            [
                "code" => 6202,
                "province_code" => 62,
                "name" => "KAB. KOTAWARINGIN TIMUR"
            ],
            [
                "code" => 6203,
                "province_code" => 62,
                "name" => "KAB. KAPUAS"
            ],
            [
                "code" => 6204,
                "province_code" => 62,
                "name" => "KAB. BARITO SELATAN"
            ],
            [
                "code" => 6205,
                "province_code" => 62,
                "name" => "KAB. BARITO UTARA"
            ],
            [
                "code" => 6206,
                "province_code" => 62,
                "name" => "KAB. KATINGAN"
            ],
            [
                "code" => 6207,
                "province_code" => 62,
                "name" => "KAB. SERUYAN"
            ],
            [
                "code" => 6208,
                "province_code" => 62,
                "name" => "KAB. SUKAMARA"
            ],
            [
                "code" => 6209,
                "province_code" => 62,
                "name" => "KAB. LAMANDAU"
            ],
            [
                "code" => 6210,
                "province_code" => 62,
                "name" => "KAB. GUNUNG MAS"
            ],
            [
                "code" => 6211,
                "province_code" => 62,
                "name" => "KAB. PULANG PISAU"
            ],
            [
                "code" => 6212,
                "province_code" => 62,
                "name" => "KAB. MURUNG RAYA"
            ],
            [
                "code" => 6213,
                "province_code" => 62,
                "name" => "KAB. BARITO TIMUR"
            ],
            [
                "code" => 6271,
                "province_code" => 62,
                "name" => "KOTA PALANGKARAYA"
            ],
            [
                "code" => 6301,
                "province_code" => 63,
                "name" => "KAB. TANAH LAUT"
            ],
            [
                "code" => 6302,
                "province_code" => 63,
                "name" => "KAB. KOTABARU"
            ],
            [
                "code" => 6303,
                "province_code" => 63,
                "name" => "KAB. BANJAR"
            ],
            [
                "code" => 6304,
                "province_code" => 63,
                "name" => "KAB. BARITO KUALA"
            ],
            [
                "code" => 6305,
                "province_code" => 63,
                "name" => "KAB. TAPIN"
            ],
            [
                "code" => 6306,
                "province_code" => 63,
                "name" => "KAB. HULU SUNGAI SELATAN"
            ],
            [
                "code" => 6307,
                "province_code" => 63,
                "name" => "KAB. HULU SUNGAI TENGAH"
            ],
            [
                "code" => 6308,
                "province_code" => 63,
                "name" => "KAB. HULU SUNGAI UTARA"
            ],
            [
                "code" => 6309,
                "province_code" => 63,
                "name" => "KAB. TABALONG"
            ],
            [
                "code" => 6310,
                "province_code" => 63,
                "name" => "KAB. TANAH BUMBU"
            ],
            [
                "code" => 6311,
                "province_code" => 63,
                "name" => "KAB. BALANGAN"
            ],
            [
                "code" => 6371,
                "province_code" => 63,
                "name" => "KOTA BANJARMASIN"
            ],
            [
                "code" => 6372,
                "province_code" => 63,
                "name" => "KOTA BANJARBARU"
            ],
            [
                "code" => 6401,
                "province_code" => 64,
                "name" => "KAB. PASER"
            ],
            [
                "code" => 6402,
                "province_code" => 64,
                "name" => "KAB. KUTAI KARTANEGARA"
            ],
            [
                "code" => 6403,
                "province_code" => 64,
                "name" => "KAB. BERAU"
            ],
            [
                "code" => 6407,
                "province_code" => 64,
                "name" => "KAB. KUTAI BARAT"
            ],
            [
                "code" => 6408,
                "province_code" => 64,
                "name" => "KAB. KUTAI TIMUR"
            ],
            [
                "code" => 6409,
                "province_code" => 64,
                "name" => "KAB. PENAJAM PASER UTARA"
            ],
            [
                "code" => 6411,
                "province_code" => 64,
                "name" => "KAB. MAHAKAM ULU"
            ],
            [
                "code" => 6471,
                "province_code" => 64,
                "name" => "KOTA BALIKPAPAN"
            ],
            [
                "code" => 6472,
                "province_code" => 64,
                "name" => "KOTA SAMARINDA"
            ],
            [
                "code" => 6474,
                "province_code" => 64,
                "name" => "KOTA BONTANG"
            ],
            [
                "code" => 6501,
                "province_code" => 65,
                "name" => "KAB. BULUNGAN"
            ],
            [
                "code" => 6502,
                "province_code" => 65,
                "name" => "KAB. MALINAU"
            ],
            [
                "code" => 6503,
                "province_code" => 65,
                "name" => "KAB. NUNUKAN"
            ],
            [
                "code" => 6504,
                "province_code" => 65,
                "name" => "KAB. TANA TIDUNG"
            ],
            [
                "code" => 6571,
                "province_code" => 65,
                "name" => "KOTA TARAKAN"
            ],
            [
                "code" => 7101,
                "province_code" => 71,
                "name" => "KAB. BOLAANG MONGONDOW"
            ],
            [
                "code" => 7102,
                "province_code" => 71,
                "name" => "KAB. MINAHASA"
            ],
            [
                "code" => 7103,
                "province_code" => 71,
                "name" => "KAB. KEPULAUAN SANGIHE"
            ],
            [
                "code" => 7104,
                "province_code" => 71,
                "name" => "KAB. KEPULAUAN TALAUD"
            ],
            [
                "code" => 7105,
                "province_code" => 71,
                "name" => "KAB. MINAHASA SELATAN"
            ],
            [
                "code" => 7106,
                "province_code" => 71,
                "name" => "KAB. MINAHASA UTARA"
            ],
            [
                "code" => 7107,
                "province_code" => 71,
                "name" => "KAB. MINAHASA TENGGARA"
            ],
            [
                "code" => 7108,
                "province_code" => 71,
                "name" => "KAB. BOLAANG MONGONDOW UTARA"
            ],
            [
                "code" => 7109,
                "province_code" => 71,
                "name" => "KAB. KEP. SIAU TAGULANDANG BIARO"
            ],
            [
                "code" => 7110,
                "province_code" => 71,
                "name" => "KAB. BOLAANG MONGONDOW TIMUR"
            ],
            [
                "code" => 7111,
                "province_code" => 71,
                "name" => "KAB. BOLAANG MONGONDOW SELATAN"
            ],
            [
                "code" => 7171,
                "province_code" => 71,
                "name" => "KOTA MANADO"
            ],
            [
                "code" => 7172,
                "province_code" => 71,
                "name" => "KOTA BITUNG"
            ],
            [
                "code" => 7173,
                "province_code" => 71,
                "name" => "KOTA TOMOHON"
            ],
            [
                "code" => 7174,
                "province_code" => 71,
                "name" => "KOTA KOTAMOBAGU"
            ],
            [
                "code" => 7201,
                "province_code" => 72,
                "name" => "KAB. BANGGAI"
            ],
            [
                "code" => 7202,
                "province_code" => 72,
                "name" => "KAB. POSO"
            ],
            [
                "code" => 7203,
                "province_code" => 72,
                "name" => "KAB. DONGGALA"
            ],
            [
                "code" => 7204,
                "province_code" => 72,
                "name" => "KAB. TOLI TOLI"
            ],
            [
                "code" => 7205,
                "province_code" => 72,
                "name" => "KAB. BUOL"
            ],
            [
                "code" => 7206,
                "province_code" => 72,
                "name" => "KAB. MOROWALI"
            ],
            [
                "code" => 7207,
                "province_code" => 72,
                "name" => "KAB. BANGGAI KEPULAUAN"
            ],
            [
                "code" => 7208,
                "province_code" => 72,
                "name" => "KAB. PARIGI MOUTONG"
            ],
            [
                "code" => 7209,
                "province_code" => 72,
                "name" => "KAB. TOJO UNA UNA"
            ],
            [
                "code" => 7210,
                "province_code" => 72,
                "name" => "KAB. SIGI"
            ],
            [
                "code" => 7211,
                "province_code" => 72,
                "name" => "KAB. BANGGAI LAUT"
            ],
            [
                "code" => 7212,
                "province_code" => 72,
                "name" => "KAB. MOROWALI UTARA"
            ],
            [
                "code" => 7271,
                "province_code" => 72,
                "name" => "KOTA PALU"
            ],
            [
                "code" => 7301,
                "province_code" => 73,
                "name" => "KAB. KEPULAUAN SELAYAR"
            ],
            [
                "code" => 7302,
                "province_code" => 73,
                "name" => "KAB. BULUKUMBA"
            ],
            [
                "code" => 7303,
                "province_code" => 73,
                "name" => "KAB. BANTAENG"
            ],
            [
                "code" => 7304,
                "province_code" => 73,
                "name" => "KAB. JENEPONTO"
            ],
            [
                "code" => 7305,
                "province_code" => 73,
                "name" => "KAB. TAKALAR"
            ],
            [
                "code" => 7306,
                "province_code" => 73,
                "name" => "KAB. GOWA"
            ],
            [
                "code" => 7307,
                "province_code" => 73,
                "name" => "KAB. SINJAI"
            ],
            [
                "code" => 7308,
                "province_code" => 73,
                "name" => "KAB. BONE"
            ],
            [
                "code" => 7309,
                "province_code" => 73,
                "name" => "KAB. MAROS"
            ],
            [
                "code" => 7310,
                "province_code" => 73,
                "name" => "KAB. PANGKAJENE KEPULAUAN"
            ],
            [
                "code" => 7311,
                "province_code" => 73,
                "name" => "KAB. BARRU"
            ],
            [
                "code" => 7312,
                "province_code" => 73,
                "name" => "KAB. SOPPENG"
            ],
            [
                "code" => 7313,
                "province_code" => 73,
                "name" => "KAB. WAJO"
            ],
            [
                "code" => 7314,
                "province_code" => 73,
                "name" => "KAB. SIDENRENG RAPPANG"
            ],
            [
                "code" => 7315,
                "province_code" => 73,
                "name" => "KAB. PINRANG"
            ],
            [
                "code" => 7316,
                "province_code" => 73,
                "name" => "KAB. ENREKANG"
            ],
            [
                "code" => 7317,
                "province_code" => 73,
                "name" => "KAB. LUWU"
            ],
            [
                "code" => 7318,
                "province_code" => 73,
                "name" => "KAB. TANA TORAJA"
            ],
            [
                "code" => 7322,
                "province_code" => 73,
                "name" => "KAB. LUWU UTARA"
            ],
            [
                "code" => 7324,
                "province_code" => 73,
                "name" => "KAB. LUWU TIMUR"
            ],
            [
                "code" => 7326,
                "province_code" => 73,
                "name" => "KAB. TORAJA UTARA"
            ],
            [
                "code" => 7371,
                "province_code" => 73,
                "name" => "KOTA MAKASSAR"
            ],
            [
                "code" => 7372,
                "province_code" => 73,
                "name" => "KOTA PARE PARE"
            ],
            [
                "code" => 7373,
                "province_code" => 73,
                "name" => "KOTA PALOPO"
            ],
            [
                "code" => 7401,
                "province_code" => 74,
                "name" => "KAB. KOLAKA"
            ],
            [
                "code" => 7402,
                "province_code" => 74,
                "name" => "KAB. KONAWE"
            ],
            [
                "code" => 7403,
                "province_code" => 74,
                "name" => "KAB. MUNA"
            ],
            [
                "code" => 7404,
                "province_code" => 74,
                "name" => "KAB. BUTON"
            ],
            [
                "code" => 7405,
                "province_code" => 74,
                "name" => "KAB. KONAWE SELATAN"
            ],
            [
                "code" => 7406,
                "province_code" => 74,
                "name" => "KAB. BOMBANA"
            ],
            [
                "code" => 7407,
                "province_code" => 74,
                "name" => "KAB. WAKATOBI"
            ],
            [
                "code" => 7408,
                "province_code" => 74,
                "name" => "KAB. KOLAKA UTARA"
            ],
            [
                "code" => 7409,
                "province_code" => 74,
                "name" => "KAB. KONAWE UTARA"
            ],
            [
                "code" => 7410,
                "province_code" => 74,
                "name" => "KAB. BUTON UTARA"
            ],
            [
                "code" => 7411,
                "province_code" => 74,
                "name" => "KAB. KOLAKA TIMUR"
            ],
            [
                "code" => 7412,
                "province_code" => 74,
                "name" => "KAB. KONAWE KEPULAUAN"
            ],
            [
                "code" => 7413,
                "province_code" => 74,
                "name" => "KAB. MUNA BARAT"
            ],
            [
                "code" => 7414,
                "province_code" => 74,
                "name" => "KAB. BUTON TENGAH"
            ],
            [
                "code" => 7415,
                "province_code" => 74,
                "name" => "KAB. BUTON SELATAN"
            ],
            [
                "code" => 7471,
                "province_code" => 74,
                "name" => "KOTA KENDARI"
            ],
            [
                "code" => 7472,
                "province_code" => 74,
                "name" => "KOTA BAU BAU"
            ],
            [
                "code" => 7501,
                "province_code" => 75,
                "name" => "KAB. GORONTALO"
            ],
            [
                "code" => 7502,
                "province_code" => 75,
                "name" => "KAB. BOALEMO"
            ],
            [
                "code" => 7503,
                "province_code" => 75,
                "name" => "KAB. BONE BOLANGO"
            ],
            [
                "code" => 7504,
                "province_code" => 75,
                "name" => "KAB. POHUWATO"
            ],
            [
                "code" => 7505,
                "province_code" => 75,
                "name" => "KAB. GORONTALO UTARA"
            ],
            [
                "code" => 7571,
                "province_code" => 75,
                "name" => "KOTA GORONTALO"
            ],
            [
                "code" => 7601,
                "province_code" => 76,
                "name" => "KAB. PASANGKAYU"
            ],
            [
                "code" => 7602,
                "province_code" => 76,
                "name" => "KAB. MAMUJU"
            ],
            [
                "code" => 7603,
                "province_code" => 76,
                "name" => "KAB. MAMASA"
            ],
            [
                "code" => 7604,
                "province_code" => 76,
                "name" => "KAB. POLEWALI MANDAR"
            ],
            [
                "code" => 7605,
                "province_code" => 76,
                "name" => "KAB. MAJENE"
            ],
            [
                "code" => 7606,
                "province_code" => 76,
                "name" => "KAB. MAMUJU TENGAH"
            ],
            [
                "code" => 8101,
                "province_code" => 81,
                "name" => "KAB. MALUKU TENGAH"
            ],
            [
                "code" => 8102,
                "province_code" => 81,
                "name" => "KAB. MALUKU TENGGARA"
            ],
            [
                "code" => 8103,
                "province_code" => 81,
                "name" => "KAB. KEPULAUAN TANIMBAR"
            ],
            [
                "code" => 8104,
                "province_code" => 81,
                "name" => "KAB. BURU"
            ],
            [
                "code" => 8105,
                "province_code" => 81,
                "name" => "KAB. SERAM BAGIAN TIMUR"
            ],
            [
                "code" => 8106,
                "province_code" => 81,
                "name" => "KAB. SERAM BAGIAN BARAT"
            ],
            [
                "code" => 8107,
                "province_code" => 81,
                "name" => "KAB. KEPULAUAN ARU"
            ],
            [
                "code" => 8108,
                "province_code" => 81,
                "name" => "KAB. MALUKU BARAT DAYA"
            ],
            [
                "code" => 8109,
                "province_code" => 81,
                "name" => "KAB. BURU SELATAN"
            ],
            [
                "code" => 8171,
                "province_code" => 81,
                "name" => "KOTA AMBON"
            ],
            [
                "code" => 8172,
                "province_code" => 81,
                "name" => "KOTA TUAL"
            ],
            [
                "code" => 8201,
                "province_code" => 82,
                "name" => "KAB. HALMAHERA BARAT"
            ],
            [
                "code" => 8202,
                "province_code" => 82,
                "name" => "KAB. HALMAHERA TENGAH"
            ],
            [
                "code" => 8203,
                "province_code" => 82,
                "name" => "KAB. HALMAHERA UTARA"
            ],
            [
                "code" => 8204,
                "province_code" => 82,
                "name" => "KAB. HALMAHERA SELATAN"
            ],
            [
                "code" => 8205,
                "province_code" => 82,
                "name" => "KAB. KEPULAUAN SULA"
            ],
            [
                "code" => 8206,
                "province_code" => 82,
                "name" => "KAB. HALMAHERA TIMUR"
            ],
            [
                "code" => 8207,
                "province_code" => 82,
                "name" => "KAB. PULAU MOROTAI"
            ],
            [
                "code" => 8208,
                "province_code" => 82,
                "name" => "KAB. PULAU TALIABU"
            ],
            [
                "code" => 8271,
                "province_code" => 82,
                "name" => "KOTA TERNATE"
            ],
            [
                "code" => 8272,
                "province_code" => 82,
                "name" => "KOTA TIDORE KEPULAUAN"
            ],
            [
                "code" => 9103,
                "province_code" => 91,
                "name" => "KAB. JAYAPURA"
            ],
            [
                "code" => 9105,
                "province_code" => 91,
                "name" => "KAB. KEPULAUAN YAPEN"
            ],
            [
                "code" => 9106,
                "province_code" => 91,
                "name" => "KAB. BIAK NUMFOR"
            ],
            [
                "code" => 9110,
                "province_code" => 91,
                "name" => "KAB. SARMI"
            ],
            [
                "code" => 9111,
                "province_code" => 91,
                "name" => "KAB. KEEROM"
            ],
            [
                "code" => 9115,
                "province_code" => 91,
                "name" => "KAB. WAROPEN"
            ],
            [
                "code" => 9119,
                "province_code" => 91,
                "name" => "KAB. SUPIORI"
            ],
            [
                "code" => 9120,
                "province_code" => 91,
                "name" => "KAB. MAMBERAMO RAYA"
            ],
            [
                "code" => 9171,
                "province_code" => 91,
                "name" => "KOTA JAYAPURA"
            ],
            [
                "code" => 9201,
                "province_code" => 92,
                "name" => "KAB. SORONG"
            ],
            [
                "code" => 9202,
                "province_code" => 92,
                "name" => "KAB. MANOKWARI"
            ],
            [
                "code" => 9203,
                "province_code" => 92,
                "name" => "KAB. FAK FAK"
            ],
            [
                "code" => 9204,
                "province_code" => 92,
                "name" => "KAB. SORONG SELATAN"
            ],
            [
                "code" => 9205,
                "province_code" => 92,
                "name" => "KAB. RAJA AMPAT"
            ],
            [
                "code" => 9206,
                "province_code" => 92,
                "name" => "KAB. TELUK BINTUNI"
            ],
            [
                "code" => 9207,
                "province_code" => 92,
                "name" => "KAB. TELUK WONDAMA"
            ],
            [
                "code" => 9208,
                "province_code" => 92,
                "name" => "KAB. KAIMANA"
            ],
            [
                "code" => 9209,
                "province_code" => 92,
                "name" => "KAB. TAMBRAUW"
            ],
            [
                "code" => 9210,
                "province_code" => 92,
                "name" => "KAB. MAYBRAT"
            ],
            [
                "code" => 9211,
                "province_code" => 92,
                "name" => "KAB. MANOKWARI SELATAN"
            ],
            [
                "code" => 9212,
                "province_code" => 92,
                "name" => "KAB. PEGUNUNGAN ARFAK"
            ],
            [
                "code" => 9271,
                "province_code" => 92,
                "name" => "KOTA SORONG"
            ],
            [
                "code" => 9301,
                "province_code" => 93,
                "name" => "KAB. MERAUKE"
            ],
            [
                "code" => 9302,
                "province_code" => 93,
                "name" => "KAB. BOVEN DIGOEL"
            ],
            [
                "code" => 9303,
                "province_code" => 93,
                "name" => "KAB. MAPPI"
            ],
            [
                "code" => 9304,
                "province_code" => 93,
                "name" => "KAB. ASMAT"
            ],
            [
                "code" => 9401,
                "province_code" => 94,
                "name" => "KAB. NABIRE"
            ],
            [
                "code" => 9402,
                "province_code" => 94,
                "name" => "KAB. PUNCAK JAYA"
            ],
            [
                "code" => 9403,
                "province_code" => 94,
                "name" => "KAB. PANIAI"
            ],
            [
                "code" => 9404,
                "province_code" => 94,
                "name" => "KAB. MIMIKA"
            ],
            [
                "code" => 9405,
                "province_code" => 94,
                "name" => "KAB. PUNCAK"
            ],
            [
                "code" => 9406,
                "province_code" => 94,
                "name" => "KAB. DOGIYAI"
            ],
            [
                "code" => 9407,
                "province_code" => 94,
                "name" => "KAB. INTAN JAYA"
            ],
            [
                "code" => 9408,
                "province_code" => 94,
                "name" => "KAB. DEIYAI"
            ],
            [
                "code" => 9501,
                "province_code" => 95,
                "name" => "KAB. JAYAWIJAYA"
            ],
            [
                "code" => 9502,
                "province_code" => 95,
                "name" => "KAB. PEGUNUNGAN BINTANG"
            ],
            [
                "code" => 9503,
                "province_code" => 95,
                "name" => "KAB. YAHUKIMO"
            ],
            [
                "code" => 9504,
                "province_code" => 95,
                "name" => "KAB. TOLIKARA"
            ],
            [
                "code" => 9505,
                "province_code" => 95,
                "name" => "KAB. MAMBERAMO TENGAH"
            ],
            [
                "code" => 9506,
                "province_code" => 95,
                "name" => "KAB. YALIMO"
            ],
            [
                "code" => 9507,
                "province_code" => 95,
                "name" => "KAB. LANNY JAYA"
            ],
            [
                "code" => 9508,
                "province_code" => 95,
                "name" => "KAB. NDUGA"
            ]
        ];

        foreach ($regencies as $regency) {
            DB::table('regencies')->insert($regency);
        }
    }
}
